/*
  Warnings:

  - A unique constraint covering the columns `[id_student,id_class,date]` on the table `frequency` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "frequency_id_student_id_class_date_key" ON "public"."frequency"("id_student", "id_class", "date");
