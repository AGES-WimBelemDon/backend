/*
  Warnings:

  - The `notes` column on the `frequency` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."NoteTypes" AS ENUM ('ATESTADO_MEDICO', 'SEM_JUSTIFICATIVA');

-- AlterTable
ALTER TABLE "public"."frequency" DROP COLUMN "notes",
ADD COLUMN     "notes" "public"."NoteTypes";
