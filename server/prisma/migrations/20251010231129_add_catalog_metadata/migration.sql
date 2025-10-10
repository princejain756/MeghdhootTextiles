/*
  Warnings:

  - A unique constraint covering the columns `[catalogCode]` on the table `catalogs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."catalogs" ADD COLUMN     "catalogCode" TEXT,
ADD COLUMN     "coverImageUrl" TEXT,
ADD COLUMN     "dispatch" TEXT,
ADD COLUMN     "fabric" TEXT,
ADD COLUMN     "itemsCount" INTEGER,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "setSize" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "catalogs_catalogCode_key" ON "public"."catalogs"("catalogCode");
