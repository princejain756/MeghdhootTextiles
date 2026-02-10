-- CreateEnum
CREATE TYPE "public"."Permission" AS ENUM ('PRODUCTS', 'CATALOGS', 'ORDERS', 'SUPPORT', 'CUSTOMERS', 'UPLOADS');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "permissions" "public"."Permission"[] DEFAULT ARRAY[]::"public"."Permission"[];
