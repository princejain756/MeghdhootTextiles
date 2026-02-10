-- Add shippingInfo and careInstructions columns to products
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "shippingInfo" TEXT;
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "careInstructions" TEXT;
