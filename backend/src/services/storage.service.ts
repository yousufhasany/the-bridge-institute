import { randomUUID } from 'node:crypto';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env, storageConfigured } from '../config/env.js';
import { ApiError } from '../utils/http.js';

/** File types accepted for upload, identified by magic bytes rather than client-supplied MIME types. */
const SIGNATURES: { mime: string; ext: string; test: (b: Buffer) => boolean }[] = [
  { mime: 'image/jpeg', ext: 'jpg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: 'image/png', ext: 'png', test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: 'image/webp', ext: 'webp', test: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP' },
  { mime: 'application/pdf', ext: 'pdf', test: (b) => b.subarray(0, 5).toString() === '%PDF-' },
];

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function detectFileType(buffer: Buffer, allowed: string[]) {
  const match = SIGNATURES.find((s) => allowed.includes(s.mime) && s.test(buffer));
  if (!match) throw ApiError.badRequest('Unsupported or invalid file type');
  return match;
}

export const sanitizeFileName = (name: string) =>
  name.replace(/[^\w.\- ]+/g, '_').replace(/\s+/g, '_').slice(-120) || 'file';

function assertConfigured() {
  if (!storageConfigured) {
    throw ApiError.unavailable('File storage is not configured', 'STORAGE_NOT_CONFIGURED');
  }
}

const base = () => env.STORAGE_URL.replace(/\/+$/, '');
const headers = () => ({ Authorization: `Bearer ${env.STORAGE_SERVICE_KEY}`, apikey: env.STORAGE_SERVICE_KEY });

const useS3 = () => Boolean(env.AWS_ENDPOINT_URL_S3 && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY);

let s3Client: S3Client | undefined;

function s3() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: env.AWS_REGION,
      endpoint: env.AWS_ENDPOINT_URL_S3,
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

function objectUrl(bucket: string, objectKey: string) {
  const endpoint = env.AWS_ENDPOINT_URL_S3.replace(/\/+$/, '');
  const key = objectKey.split('/').map(encodeURIComponent).join('/');
  return `${endpoint}/${encodeURIComponent(bucket)}/${key}`;
}

/** Uploads a file. The storage secret never leaves the server. */
export async function putObject(visibility: 'PUBLIC' | 'PRIVATE', folder: string, ext: string, mime: string, data: Buffer) {
  assertConfigured();
  const bucket = visibility === 'PUBLIC' ? env.STORAGE_PUBLIC_BUCKET : env.STORAGE_PRIVATE_BUCKET;
  const objectKey = `${folder}/${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${ext}`;
  if (useS3()) {
    await s3().send(new PutObjectCommand({ Bucket: bucket, Key: objectKey, Body: data, ContentType: mime }));
    return { bucket, objectKey };
  }
  const response = await fetch(`${base()}/storage/v1/object/${bucket}/${objectKey}`, {
    method: 'POST',
    headers: { ...headers(), 'Content-Type': mime, 'x-upsert': 'false' },
    body: new Uint8Array(data),
  });
  if (!response.ok) throw ApiError.unavailable('Upload failed', 'STORAGE_ERROR');
  return { bucket, objectKey };
}

export function publicUrl(bucket: string, objectKey: string) {
  if (!storageConfigured) return null;
  if (useS3()) return objectUrl(bucket, objectKey);
  return `${base()}/storage/v1/object/public/${bucket}/${objectKey}`;
}

/** Short-lived signed URL for private objects. Callers must check authorisation first. */
export async function signedUrl(bucket: string, objectKey: string, expiresIn = 300) {
  assertConfigured();
  if (useS3()) {
    return getSignedUrl(s3(), new GetObjectCommand({ Bucket: bucket, Key: objectKey }), { expiresIn });
  }
  const response = await fetch(`${base()}/storage/v1/object/sign/${bucket}/${objectKey}`, {
    method: 'POST',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn }),
  });
  if (!response.ok) throw ApiError.unavailable('Could not sign URL', 'STORAGE_ERROR');
  const json = (await response.json()) as { signedURL?: string };
  return json.signedURL ? `${base()}/storage/v1${json.signedURL}` : null;
}
