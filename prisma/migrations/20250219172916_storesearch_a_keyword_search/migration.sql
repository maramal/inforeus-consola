/*
  Warnings:

  - You are about to drop the `StoreSearch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "StoreSearch";

-- CreateTable
CREATE TABLE "KeywordSearch" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KeywordSearch_pkey" PRIMARY KEY ("id")
);
