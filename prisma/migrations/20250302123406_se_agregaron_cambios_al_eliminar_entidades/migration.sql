-- DropForeignKey
ALTER TABLE "StoreVisit" DROP CONSTRAINT "StoreVisit_storeId_fkey";

-- AddForeignKey
ALTER TABLE "StoreVisit" ADD CONSTRAINT "StoreVisit_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
