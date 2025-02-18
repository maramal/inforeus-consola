/*
  Warnings:

  - The values [Published,NotPublished] on the enum `StoreStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Admin,Customer] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [Active,Inactive] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StoreStatus_new" AS ENUM ('Activo', 'Inactivo');
ALTER TABLE "Store" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Store" ALTER COLUMN "status" TYPE "StoreStatus_new" USING ("status"::text::"StoreStatus_new");
ALTER TYPE "StoreStatus" RENAME TO "StoreStatus_old";
ALTER TYPE "StoreStatus_new" RENAME TO "StoreStatus";
DROP TYPE "StoreStatus_old";
ALTER TABLE "Store" ALTER COLUMN "status" SET DEFAULT 'Activo';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('Administrador', 'Cliente');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Cliente';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('Activo', 'Inactivo');
ALTER TABLE "User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'Activo';
COMMIT;

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "status" SET DEFAULT 'Activo';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Cliente',
ALTER COLUMN "status" SET DEFAULT 'Activo';
