-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."EmploymentStatus" ADD VALUE 'ESTUDANTE';
ALTER TYPE "public"."EmploymentStatus" ADD VALUE 'ESTAGIARIO';
ALTER TYPE "public"."EmploymentStatus" ADD VALUE 'APRENDIZ';
ALTER TYPE "public"."EmploymentStatus" ADD VALUE 'AUTONOMO';
ALTER TYPE "public"."EmploymentStatus" ADD VALUE 'OUTRO';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."SchoolYear" ADD VALUE 'FUNDAMENTAL_3';
ALTER TYPE "public"."SchoolYear" ADD VALUE 'FUNDAMENTAL_4';
ALTER TYPE "public"."SchoolYear" ADD VALUE 'FUNDAMENTAL_5';
ALTER TYPE "public"."SchoolYear" ADD VALUE 'FUNDAMENTAL_6';
ALTER TYPE "public"."SchoolYear" ADD VALUE 'FUNDAMENTAL_7';
ALTER TYPE "public"."SchoolYear" ADD VALUE 'FUNDAMENTAL_8';
ALTER TYPE "public"."SchoolYear" ADD VALUE 'FUNDAMENTAL_9';
