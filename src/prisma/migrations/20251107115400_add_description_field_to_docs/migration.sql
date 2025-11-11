/*
  Warnings:

  - Added the required column `description` to the `doc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."doc" ADD COLUMN     "description" TEXT NOT NULL;
