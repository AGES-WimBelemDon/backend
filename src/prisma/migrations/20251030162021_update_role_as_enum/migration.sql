/*
  Warnings:

  - You are about to drop the column `role_id` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('any', 'admin', 'manager', 'teacher', 'psychologist', 'intern', 'developer');

-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_role_id_fkey";

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "role_id",
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'any',
ALTER COLUMN "address_id" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."role";

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
