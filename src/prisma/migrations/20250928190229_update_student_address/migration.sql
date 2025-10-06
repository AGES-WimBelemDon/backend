-- DropForeignKey
ALTER TABLE "public"."student" DROP CONSTRAINT "student_address_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."student" ADD CONSTRAINT "student_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
