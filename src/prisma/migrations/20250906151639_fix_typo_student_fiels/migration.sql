/*
  Warnings:

  - You are about to drop the column `schoolYear` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `socialPrograms` on the `student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."student" DROP COLUMN "schoolYear",
DROP COLUMN "socialPrograms",
ADD COLUMN     "school_year" "public"."SchoolYear",
ADD COLUMN     "social_programs" "public"."SocialProgram";
