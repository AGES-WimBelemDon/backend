/*
  Warnings:

  - Added the required column `registration_number` to the `family_member` table without a default value. This is not possible if the table is not empty.
  - Made the column `date_of_birth` on table `family_member` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."family_member" ADD COLUMN     "nis" TEXT,
ADD COLUMN     "registration_number" TEXT NOT NULL,
ALTER COLUMN "date_of_birth" SET NOT NULL;
