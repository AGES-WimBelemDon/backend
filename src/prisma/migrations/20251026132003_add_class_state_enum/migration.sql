/*
  Warnings:

  - Changed the type of `state` on the `class` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `end_time` on table `class` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."ClassState" AS ENUM ('ATIVA', 'INATIVA');

-- AlterTable
ALTER TABLE "public"."class" DROP COLUMN "state",
ADD COLUMN     "state" "public"."ClassState" NOT NULL,
ALTER COLUMN "end_time" SET NOT NULL;
