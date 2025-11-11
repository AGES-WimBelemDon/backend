-- CreateEnum
CREATE TYPE "public"."FileStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "public"."doc" ADD COLUMN     "status" "public"."FileStatus" NOT NULL DEFAULT 'PENDING';
