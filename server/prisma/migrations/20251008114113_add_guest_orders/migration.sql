-- CreateTable
CREATE TABLE "public"."guest_orders" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "gst" TEXT,
    "email" TEXT,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "totalItems" INTEGER NOT NULL,
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guest_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "guest_orders_phone_idx" ON "public"."guest_orders"("phone");

-- CreateIndex
CREATE INDEX "guest_orders_businessName_idx" ON "public"."guest_orders"("businessName");
