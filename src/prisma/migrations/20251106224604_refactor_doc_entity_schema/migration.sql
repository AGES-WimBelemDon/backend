/*
  Warnings:

  - The primary key for the `doc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `enrollment_date` on the `doc` table. All the data in the column will be lost.
  - You are about to drop the column `id_student` on the `doc` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `doc` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `doc` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `doc` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storagePath]` on the table `doc` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentType` to the `doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storagePath` to the `doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `doc` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."doc" DROP CONSTRAINT "doc_id_student_fkey";

-- DropIndex
DROP INDEX "public"."doc_slug_key";

-- AlterTable
ALTER TABLE "public"."doc" DROP CONSTRAINT "doc_pkey",
DROP COLUMN "enrollment_date",
DROP COLUMN "id_student",
DROP COLUMN "name",
DROP COLUMN "slug",
DROP COLUMN "type",
ADD COLUMN     "contentType" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "storagePath" TEXT NOT NULL,
ADD COLUMN     "studentId" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "doc_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "doc_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "doc_storagePath_key" ON "public"."doc"("storagePath");

-- CreateIndex
CREATE INDEX "doc_studentId_idx" ON "public"."doc"("studentId");

-- AddForeignKey
ALTER TABLE "public"."doc" ADD CONSTRAINT "doc_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
