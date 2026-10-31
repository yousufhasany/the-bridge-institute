-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('PENDING', 'APPROVED', 'ISSUED', 'REVOKED');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('PROSPECT', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'IN_REVIEW', 'CONTACTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('INTERNSHIP', 'JOB', 'TRAINING', 'PROJECT', 'MENTORING', 'OTHER');

-- CreateEnum
CREATE TYPE "OpportunityAudience" AS ENUM ('STUDENTS', 'ALUMNI', 'ALL');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AlumniVerification" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StoryStatus" AS ENUM ('SUBMITTED', 'PUBLISHED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AssetVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "preferredLocale" TEXT NOT NULL DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "assignedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "revokedAt" TIMESTAMPTZ(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL DEFAULT 'reset',
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "usedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseCategory" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CourseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'book-open',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "categoryId" UUID,
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTranslation" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CourseTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTopic" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "textEn" TEXT NOT NULL,
    "textBn" TEXT,

    CONSTRAINT "CourseTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningOutcome" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "textEn" TEXT NOT NULL,
    "textBn" TEXT,

    CONSTRAINT "LearningOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingBatch" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "courseId" UUID,
    "startDate" DATE,
    "endDate" DATE,
    "capacity" INTEGER,
    "status" "BatchStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "TrainingBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BatchTeacher" (
    "batchId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "BatchTeacher_pkey" PRIMARY KEY ("batchId","userId")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "studentCode" TEXT NOT NULL,
    "educationLevel" TEXT,
    "currentStatus" TEXT,
    "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
    "graduatedAt" TIMESTAMPTZ(3),
    "sourceApplicationId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "batchId" UUID NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "enrolledAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMPTZ(3),

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" UUID NOT NULL,
    "enrollmentId" UUID NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "note" TEXT,
    "recordedById" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" UUID NOT NULL,
    "batchId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'assignment',
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "dueDate" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" UUID NOT NULL,
    "assessmentId" UUID NOT NULL,
    "enrollmentId" UUID NOT NULL,
    "score" DECIMAL(6,2) NOT NULL,
    "feedback" TEXT,
    "gradedById" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningMaterial" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "assetId" UUID,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "LearningMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" UUID NOT NULL,
    "enrollmentId" UUID NOT NULL,
    "certificateNo" TEXT NOT NULL,
    "status" "CertificateStatus" NOT NULL DEFAULT 'PENDING',
    "approvedById" UUID,
    "approvedAt" TIMESTAMPTZ(3),
    "issuedAt" TIMESTAMPTZ(3),
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentApplication" (
    "id" UUID NOT NULL,
    "referenceCode" TEXT NOT NULL,
    "idempotencyKey" TEXT,
    "userId" UUID,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "highestEducation" TEXT,
    "areaOfInterest" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "preferredContact" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "consentAt" TIMESTAMPTZ(3) NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "StudentApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationStatusHistory" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "fromStatus" "ApplicationStatus",
    "toStatus" "ApplicationStatus" NOT NULL,
    "changedById" UUID,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationInternalNote" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "authorId" UUID,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationInternalNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "industry" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "status" "CompanyStatus" NOT NULL DEFAULT 'PROSPECT',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnershipInquiry" (
    "id" UUID NOT NULL,
    "organizationName" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "workEmail" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "interest" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "consentAt" TIMESTAMPTZ(3) NOT NULL,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "companyId" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "PartnershipInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnershipInteraction" (
    "id" UUID NOT NULL,
    "inquiryId" UUID,
    "companyId" UUID,
    "authorId" UUID,
    "type" TEXT NOT NULL DEFAULT 'note',
    "note" TEXT NOT NULL,
    "occurredAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnershipInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" UUID NOT NULL,
    "companyId" UUID,
    "title" TEXT NOT NULL,
    "type" "OpportunityType" NOT NULL DEFAULT 'OTHER',
    "description" TEXT NOT NULL,
    "location" TEXT,
    "applyUrl" TEXT,
    "deadline" TIMESTAMPTZ(3),
    "audience" "OpportunityAudience" NOT NULL DEFAULT 'ALL',
    "status" "OpportunityStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniCohort" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "graduationYear" INTEGER,
    "courseId" UUID,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AlumniCohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniProfile" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "studentProfileId" UUID,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "cohortId" UUID,
    "courseId" UUID,
    "graduationYear" INTEGER,
    "programName" TEXT,
    "professionalTitle" TEXT,
    "organization" TEXT,
    "professionalField" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bioEn" TEXT,
    "bioBn" TEXT,
    "linkedinUrl" TEXT,
    "portfolioUrl" TEXT,
    "photoAssetId" UUID,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "verificationStatus" "AlumniVerification" NOT NULL DEFAULT 'PENDING',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "publicConsentAt" TIMESTAMPTZ(3),
    "publicationStatus" "PublicationStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "pendingChanges" JSONB,
    "reviewNote" TEXT,
    "archivedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AlumniProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniRegistrationRequest" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "graduationYear" INTEGER,
    "courseId" UUID,
    "cohortId" UUID,
    "studentCode" TEXT,
    "message" TEXT,
    "matchedStudentId" UUID,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "reviewedById" UUID,
    "reviewedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlumniRegistrationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniStory" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "titleEn" TEXT,
    "titleBn" TEXT,
    "excerptEn" TEXT,
    "excerptBn" TEXT,
    "bodyEn" TEXT,
    "bodyBn" TEXT,
    "imageAssetId" UUID,
    "status" "StoryStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewNote" TEXT,
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AlumniStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlumniAnnouncement" (
    "id" UUID NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleBn" TEXT,
    "bodyEn" TEXT NOT NULL,
    "bodyBn" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AlumniAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteSection" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "draftContent" JSONB NOT NULL,
    "publishedContent" JSONB,
    "publishedAt" TIMESTAMPTZ(3),
    "updatedById" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "WebsiteSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteSetting" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "updatedById" UUID,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "WebsiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" UUID NOT NULL,
    "questionEn" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "questionBn" TEXT,
    "answerBn" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" UUID NOT NULL,
    "bucket" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "visibility" "AssetVisibility" NOT NULL DEFAULT 'PRIVATE',
    "altText" TEXT,
    "uploadedById" UUID,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "userId" UUID,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT,
    "readAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "actorId" UUID,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Role_key_key" ON "Role"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseCategory_slug_key" ON "CourseCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE INDEX "Course_status_sortOrder_idx" ON "Course"("status", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CourseTranslation_courseId_locale_key" ON "CourseTranslation"("courseId", "locale");

-- CreateIndex
CREATE INDEX "CourseTopic_courseId_sortOrder_idx" ON "CourseTopic"("courseId", "sortOrder");

-- CreateIndex
CREATE INDEX "LearningOutcome_courseId_sortOrder_idx" ON "LearningOutcome"("courseId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingBatch_code_key" ON "TrainingBatch"("code");

-- CreateIndex
CREATE INDEX "TrainingBatch_status_idx" ON "TrainingBatch"("status");

-- CreateIndex
CREATE INDEX "BatchTeacher_userId_idx" ON "BatchTeacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_studentCode_key" ON "StudentProfile"("studentCode");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_sourceApplicationId_key" ON "StudentProfile"("sourceApplicationId");

-- CreateIndex
CREATE INDEX "StudentProfile_status_idx" ON "StudentProfile"("status");

-- CreateIndex
CREATE INDEX "Enrollment_batchId_idx" ON "Enrollment"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_batchId_key" ON "Enrollment"("studentId", "batchId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_enrollmentId_date_key" ON "Attendance"("enrollmentId", "date");

-- CreateIndex
CREATE INDEX "Assessment_batchId_idx" ON "Assessment"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResult_assessmentId_enrollmentId_key" ON "AssessmentResult"("assessmentId", "enrollmentId");

-- CreateIndex
CREATE INDEX "LearningMaterial_courseId_idx" ON "LearningMaterial"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_enrollmentId_key" ON "Certificate"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateNo_key" ON "Certificate"("certificateNo");

-- CreateIndex
CREATE UNIQUE INDEX "StudentApplication_referenceCode_key" ON "StudentApplication"("referenceCode");

-- CreateIndex
CREATE UNIQUE INDEX "StudentApplication_idempotencyKey_key" ON "StudentApplication"("idempotencyKey");

-- CreateIndex
CREATE INDEX "StudentApplication_email_idx" ON "StudentApplication"("email");

-- CreateIndex
CREATE INDEX "StudentApplication_status_createdAt_idx" ON "StudentApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "StudentApplication_userId_idx" ON "StudentApplication"("userId");

-- CreateIndex
CREATE INDEX "ApplicationStatusHistory_applicationId_idx" ON "ApplicationStatusHistory"("applicationId");

-- CreateIndex
CREATE INDEX "ApplicationInternalNote_applicationId_idx" ON "ApplicationInternalNote"("applicationId");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "PartnershipInquiry_status_createdAt_idx" ON "PartnershipInquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PartnershipInteraction_inquiryId_idx" ON "PartnershipInteraction"("inquiryId");

-- CreateIndex
CREATE INDEX "PartnershipInteraction_companyId_idx" ON "PartnershipInteraction"("companyId");

-- CreateIndex
CREATE INDEX "Opportunity_status_audience_idx" ON "Opportunity"("status", "audience");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniCohort_slug_key" ON "AlumniCohort"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniProfile_userId_key" ON "AlumniProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniProfile_studentProfileId_key" ON "AlumniProfile"("studentProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniProfile_slug_key" ON "AlumniProfile"("slug");

-- CreateIndex
CREATE INDEX "AlumniProfile_verificationStatus_isPublic_publicationStatus_idx" ON "AlumniProfile"("verificationStatus", "isPublic", "publicationStatus");

-- CreateIndex
CREATE INDEX "AlumniProfile_graduationYear_idx" ON "AlumniProfile"("graduationYear");

-- CreateIndex
CREATE INDEX "AlumniRegistrationRequest_status_createdAt_idx" ON "AlumniRegistrationRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "AlumniRegistrationRequest_userId_idx" ON "AlumniRegistrationRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AlumniStory_slug_key" ON "AlumniStory"("slug");

-- CreateIndex
CREATE INDEX "AlumniStory_status_publishedAt_idx" ON "AlumniStory"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "AlumniAnnouncement_status_publishedAt_idx" ON "AlumniAnnouncement"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteSection_key_locale_key" ON "WebsiteSection"("key", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteSetting_key_key" ON "WebsiteSetting"("key");

-- CreateIndex
CREATE INDEX "WebsiteSetting_group_idx" ON "WebsiteSetting"("group");

-- CreateIndex
CREATE INDEX "Faq_isPublished_sortOrder_idx" ON "Faq"("isPublished", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_bucket_objectKey_key" ON "MediaAsset"("bucket", "objectKey");

-- CreateIndex
CREATE INDEX "ContactMessage_isRead_createdAt_idx" ON "ContactMessage"("isRead", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CourseCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTranslation" ADD CONSTRAINT "CourseTranslation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTopic" ADD CONSTRAINT "CourseTopic_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningOutcome" ADD CONSTRAINT "LearningOutcome_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingBatch" ADD CONSTRAINT "TrainingBatch_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchTeacher" ADD CONSTRAINT "BatchTeacher_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "TrainingBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchTeacher" ADD CONSTRAINT "BatchTeacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_sourceApplicationId_fkey" FOREIGN KEY ("sourceApplicationId") REFERENCES "StudentApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "TrainingBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "TrainingBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningMaterial" ADD CONSTRAINT "LearningMaterial_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningMaterial" ADD CONSTRAINT "LearningMaterial_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentApplication" ADD CONSTRAINT "StudentApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "StudentApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationStatusHistory" ADD CONSTRAINT "ApplicationStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationInternalNote" ADD CONSTRAINT "ApplicationInternalNote_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "StudentApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationInternalNote" ADD CONSTRAINT "ApplicationInternalNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipInquiry" ADD CONSTRAINT "PartnershipInquiry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipInteraction" ADD CONSTRAINT "PartnershipInteraction_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "PartnershipInquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipInteraction" ADD CONSTRAINT "PartnershipInteraction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnershipInteraction" ADD CONSTRAINT "PartnershipInteraction_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniCohort" ADD CONSTRAINT "AlumniCohort_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniProfile" ADD CONSTRAINT "AlumniProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniProfile" ADD CONSTRAINT "AlumniProfile_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniProfile" ADD CONSTRAINT "AlumniProfile_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "AlumniCohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniProfile" ADD CONSTRAINT "AlumniProfile_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniProfile" ADD CONSTRAINT "AlumniProfile_photoAssetId_fkey" FOREIGN KEY ("photoAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniRegistrationRequest" ADD CONSTRAINT "AlumniRegistrationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniRegistrationRequest" ADD CONSTRAINT "AlumniRegistrationRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniRegistrationRequest" ADD CONSTRAINT "AlumniRegistrationRequest_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "AlumniCohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniStory" ADD CONSTRAINT "AlumniStory_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "AlumniProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlumniStory" ADD CONSTRAINT "AlumniStory_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
