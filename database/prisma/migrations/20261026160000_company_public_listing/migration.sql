-- AlterTable
ALTER TABLE "Company" ADD COLUMN "listedPublicly" BOOLEAN NOT NULL DEFAULT false;

-- Companies already marked Active are the current partnerships and should appear by name.
UPDATE "Company" SET "listedPublicly" = true WHERE "status" = 'ACTIVE';
