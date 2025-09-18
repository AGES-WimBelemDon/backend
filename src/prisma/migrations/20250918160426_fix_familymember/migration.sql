/*
  Warnings:

  - You are about to drop the column `id_student` on the `family_member` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."family_member" DROP CONSTRAINT "family_member_address_id_fkey";

-- AlterTable
ALTER TABLE "public"."family_member" DROP COLUMN "id_student",
ALTER COLUMN "address_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."family_member" ADD CONSTRAINT "family_member_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
