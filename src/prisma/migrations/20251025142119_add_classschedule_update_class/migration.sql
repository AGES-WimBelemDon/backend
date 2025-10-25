/*
  Warnings:

  - Added the required column `start_date` to the `class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `class` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."DayOfWeek" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- AlterTable
ALTER TABLE "public"."class" ADD COLUMN     "end_date" DATE,
ADD COLUMN     "end_time" TIME,
ADD COLUMN     "is_recurrent" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "start_date" DATE NOT NULL,
ADD COLUMN     "start_time" TIME NOT NULL;

-- CreateTable
CREATE TABLE "public"."class_schedule" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER NOT NULL,
    "day_of_week" "public"."DayOfWeek" NOT NULL,

    CONSTRAINT "class_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "class_schedule_class_id_idx" ON "public"."class_schedule"("class_id");

-- CreateIndex
CREATE UNIQUE INDEX "class_schedule_class_id_day_of_week_key" ON "public"."class_schedule"("class_id", "day_of_week");

-- AddForeignKey
ALTER TABLE "public"."class_schedule" ADD CONSTRAINT "class_schedule_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE CASCADE ON UPDATE CASCADE;
