-- CreateTable
CREATE TABLE "public"."catalogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."catalog_products" (
    "catalogId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "catalog_products_pkey" PRIMARY KEY ("catalogId","productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "catalogs_slug_key" ON "public"."catalogs"("slug");

-- CreateIndex
CREATE INDEX "catalog_products_catalogId_idx" ON "public"."catalog_products"("catalogId");

-- CreateIndex
CREATE INDEX "catalog_products_productId_idx" ON "public"."catalog_products"("productId");

-- AddForeignKey
ALTER TABLE "public"."catalog_products" ADD CONSTRAINT "catalog_products_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "public"."catalogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."catalog_products" ADD CONSTRAINT "catalog_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
