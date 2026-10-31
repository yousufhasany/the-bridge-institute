import type { Request, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { P } from '../config/permissions.js';
import { prisma } from '../lib/prisma.js';
import { currentUser, hasPermission } from '../middleware/auth.js';
import { audit } from '../services/audit.service.js';
import { MAX_UPLOAD_BYTES, detectFileType, publicUrl, putObject, sanitizeFileName, signedUrl } from '../services/storage.service.js';
import { ApiError, created, idParam, ok, parse } from '../utils/http.js';

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
}).single('file');

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const uploadFields = z.object({
  purpose: z.enum(['alumni-photo', 'story-image', 'cms-image', 'learning-material']),
  altText: z.string().trim().max(200).optional(),
});

/** Who may upload what. Alumni may only upload public images for their own profile and stories. */
function rulesFor(req: Request, purpose: z.infer<typeof uploadFields>['purpose']) {
  switch (purpose) {
    case 'alumni-photo':
    case 'story-image':
      if (!hasPermission(req, P.alumniSelf) && !hasPermission(req, P.alumniManage)) throw ApiError.forbidden();
      return { types: IMAGE_TYPES, visibility: 'PUBLIC' as const };
    case 'cms-image':
      if (!hasPermission(req, P.cmsEdit)) throw ApiError.forbidden();
      return { types: IMAGE_TYPES, visibility: 'PUBLIC' as const };
    case 'learning-material':
      if (!hasPermission(req, P.coursesManage)) throw ApiError.forbidden();
      return { types: [...IMAGE_TYPES, 'application/pdf'], visibility: 'PRIVATE' as const };
  }
}

export async function upload(req: Request, res: Response) {
  const auth = currentUser(req);
  const fields = parse(uploadFields, req.body ?? {});
  const rules = rulesFor(req, fields.purpose);
  if (!req.file) throw ApiError.badRequest('No file uploaded');
  const type = detectFileType(req.file.buffer, rules.types);
  const { bucket, objectKey } = await putObject(rules.visibility, fields.purpose, type.ext, type.mime, req.file.buffer);
  const asset = await prisma.mediaAsset.create({
    data: {
      bucket,
      objectKey,
      fileName: sanitizeFileName(req.file.originalname),
      mimeType: type.mime,
      sizeBytes: req.file.size,
      visibility: rules.visibility,
      altText: fields.altText,
      uploadedById: auth.id,
    },
  });
  await audit(req, { action: 'media.upload', entityType: 'MediaAsset', entityId: asset.id, metadata: { purpose: fields.purpose } });
  created(res, { id: asset.id, fileName: asset.fileName, mimeType: asset.mimeType, url: asset.visibility === 'PUBLIC' ? publicUrl(bucket, objectKey) : null });
}

/** Private files are served through short-lived signed URLs after an ownership/permission check. */
export async function url(req: Request, res: Response) {
  const auth = currentUser(req);
  const asset = await prisma.mediaAsset.findUnique({ where: { id: idParam(req) }, include: { materials: { select: { courseId: true, isPublished: true } } } });
  if (!asset) throw ApiError.notFound();
  if (asset.visibility === 'PUBLIC') return ok(res, { url: publicUrl(asset.bucket, asset.objectKey) });

  let allowed = asset.uploadedById === auth.id || hasPermission(req, P.coursesManage);
  if (!allowed && asset.materials.length) {
    const courseIds = asset.materials.filter((m) => m.isPublished).map((m) => m.courseId);
    allowed =
      courseIds.length > 0 &&
      (await prisma.enrollment.count({ where: { student: { userId: auth.id }, batch: { courseId: { in: courseIds } }, status: { not: 'WITHDRAWN' } } })) > 0;
  }
  if (!allowed) throw ApiError.notFound();
  ok(res, { url: await signedUrl(asset.bucket, asset.objectKey) });
}
