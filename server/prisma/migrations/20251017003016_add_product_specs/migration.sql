-- Add specs JSON column to products
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "specs" JSONB;
