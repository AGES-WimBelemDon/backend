/*
  Warnings:

  - The values [PRESENT,ABSENT] on the enum `FrequencyStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,INACTIVE] on the enum `StudentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,INACTIVE] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `id_form` on the `answer` table. All the data in the column will be lost.
  - You are about to drop the column `id_student` on the `form` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `question` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `question` table. All the data in the column will be lost.
  - You are about to drop the `family` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `studentId` to the `answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `form` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formId` to the `question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."FormType" AS ENUM ('PSICOLOGIA', 'SOCIAL');

-- CreateEnum
CREATE TYPE "public"."Race" AS ENUM ('BRANCA', 'PRETA', 'PARDA', 'AMARELA', 'INDIGENA', 'NA');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MASCULINO', 'FEMININO', 'HOMEM_TRANS', 'MULHER_TRANS', 'TRAVESTI', 'NAO_BINARIO', 'OUTRO');

-- CreateEnum
CREATE TYPE "public"."SocialProgram" AS ENUM ('BOLSA_FAMILIA', 'BPC_LOAS', 'TARIFA_SOCIAL_ENERGIA', 'AUXILIO_GAS', 'PROGRAMA_ESTADUAL', 'PROGRAMA_MUNICIPAL_VIA_CRAS');

-- CreateEnum
CREATE TYPE "public"."EmploymentStatus" AS ENUM ('EMPREGADO', 'DESEMPREGADO');

-- CreateEnum
CREATE TYPE "public"."SchoolYear" AS ENUM ('EDUCACAO_INFANTIL', 'FUNDAMENTAL_1', 'FUNDAMENTAL_2', 'ENSINO_MEDIO_1', 'ENSINO_MEDIO_2', 'ENSINO_MEDIO_3', 'EJA');

-- CreateEnum
CREATE TYPE "public"."EducationLevel" AS ENUM ('NENHUM', 'ALFABETIZADO', 'FUNDAMENTAL_INCOMPLETO', 'FUNDAMENTAL_COMPLETO', 'ENSINO_MEDIO_INCOMPLETO', 'ENSINO_MEDIO_COMPLETO', 'SUPERIOR_INCOMPLETO', 'SUPERIOR_COMPLETO', 'POS_GRADUACAO');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."FrequencyStatus_new" AS ENUM ('PRESENTE', 'AUSENTE');
ALTER TABLE "public"."frequency" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."frequency" ALTER COLUMN "status" TYPE "public"."FrequencyStatus_new" USING ("status"::text::"public"."FrequencyStatus_new");
ALTER TYPE "public"."FrequencyStatus" RENAME TO "FrequencyStatus_old";
ALTER TYPE "public"."FrequencyStatus_new" RENAME TO "FrequencyStatus";
DROP TYPE "public"."FrequencyStatus_old";
ALTER TABLE "public"."frequency" ALTER COLUMN "status" SET DEFAULT 'PRESENTE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."StudentStatus_new" AS ENUM ('ATIVO', 'INATIVO');
ALTER TABLE "public"."student" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."student" ALTER COLUMN "status" TYPE "public"."StudentStatus_new" USING ("status"::text::"public"."StudentStatus_new");
ALTER TYPE "public"."StudentStatus" RENAME TO "StudentStatus_old";
ALTER TYPE "public"."StudentStatus_new" RENAME TO "StudentStatus";
DROP TYPE "public"."StudentStatus_old";
ALTER TABLE "public"."student" ALTER COLUMN "status" SET DEFAULT 'ATIVO';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserStatus_new" AS ENUM ('ATIVO', 'INATIVO');
ALTER TABLE "public"."user" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."user" ALTER COLUMN "status" TYPE "public"."UserStatus_new" USING ("status"::text::"public"."UserStatus_new");
ALTER TYPE "public"."UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "public"."UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "public"."UserStatus_old";
ALTER TABLE "public"."user" ALTER COLUMN "status" SET DEFAULT 'ATIVO';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."_StudentFamily" DROP CONSTRAINT "_StudentFamily_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."answer" DROP CONSTRAINT "answer_id_form_fkey";

-- DropForeignKey
ALTER TABLE "public"."family" DROP CONSTRAINT "family_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."form" DROP CONSTRAINT "form_id_student_fkey";

-- AlterTable
ALTER TABLE "public"."answer" DROP COLUMN "id_form",
ADD COLUMN     "studentId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."form" DROP COLUMN "id_student",
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "public"."FormType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."frequency" ALTER COLUMN "status" SET DEFAULT 'PRESENTE';

-- AlterTable
ALTER TABLE "public"."question" DROP COLUMN "options",
DROP COLUMN "type",
ADD COLUMN     "formId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."student" ADD COLUMN     "employment_status" "public"."EmploymentStatus",
ADD COLUMN     "gender" "public"."Gender",
ADD COLUMN     "grade_gap" BOOLEAN,
ADD COLUMN     "race" "public"."Race",
ADD COLUMN     "schoolYear" "public"."SchoolYear",
ADD COLUMN     "school_name" TEXT,
ADD COLUMN     "school_shift" TEXT,
ADD COLUMN     "socialPrograms" "public"."SocialProgram",
ADD COLUMN     "social_name" TEXT,
ALTER COLUMN "status" SET DEFAULT 'ATIVO';

-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "status" SET DEFAULT 'ATIVO';

-- DropTable
DROP TABLE "public"."family";

-- CreateTable
CREATE TABLE "public"."family_member" (
    "id" SERIAL NOT NULL,
    "id_student" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT,
    "social_name" TEXT,
    "race" "public"."Race",
    "gender" "public"."Gender",
    "education_level" "public"."EducationLevel",
    "date_of_birth" DATE,
    "social_programs" "public"."SocialProgram",
    "employment_status" "public"."EmploymentStatus",

    CONSTRAINT "family_member_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."family_member" ADD CONSTRAINT "family_member_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."question" ADD CONSTRAINT "question_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answer" ADD CONSTRAINT "answer_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_StudentFamily" ADD CONSTRAINT "_StudentFamily_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."family_member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
