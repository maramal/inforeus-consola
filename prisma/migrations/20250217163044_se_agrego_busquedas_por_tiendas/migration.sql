-- CreateTable
CREATE TABLE "StoreSearch" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoreSearch_pkey" PRIMARY KEY ("id")
);
