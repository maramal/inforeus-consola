/*
  Warnings:

  - You are about to drop the column `logoId` on the `Store` table. All the data in the column will be lost.
  - Added the required column `logoUrl` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "logoId",
ADD COLUMN     "logoUrl" TEXT NOT NULL;
