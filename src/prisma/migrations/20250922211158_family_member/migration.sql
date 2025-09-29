-- DropForeignKey
ALTER TABLE "public"."family_member" DROP CONSTRAINT "family_member_address_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."family_member" ADD CONSTRAINT "family_member_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
