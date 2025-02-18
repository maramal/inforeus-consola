-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Inactive');

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "status" "StoreStatus" NOT NULL DEFAULT 'Published';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'Customer',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'Active';
