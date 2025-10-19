/*
  Warnings:

  - You are about to drop the column `id_question` on the `answer` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `answer` table. All the data in the column will be lost.
  - You are about to drop the column `formId` on the `question` table. All the data in the column will be lost.
  - Added the required column `question_id` to the `answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `form_id` to the `question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."answer" DROP CONSTRAINT "answer_id_question_fkey";

-- DropForeignKey
ALTER TABLE "public"."answer" DROP CONSTRAINT "answer_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."question" DROP CONSTRAINT "question_formId_fkey";

-- AlterTable
ALTER TABLE "public"."answer" DROP COLUMN "id_question",
DROP COLUMN "studentId",
ADD COLUMN     "question_id" INTEGER NOT NULL,
ADD COLUMN     "student_id" INTEGER NOT NULL,
ADD COLUMN     "submission_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."question" DROP COLUMN "formId",
ADD COLUMN     "form_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."question" ADD CONSTRAINT "question_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answer" ADD CONSTRAINT "answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answer" ADD CONSTRAINT "answer_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
