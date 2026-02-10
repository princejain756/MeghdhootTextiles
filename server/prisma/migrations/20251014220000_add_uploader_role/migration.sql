-- Add new role value 'UPLOADER' to the Role enum
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'Role' AND e.enumlabel = 'UPLOADER'
  ) THEN
    ALTER TYPE "public"."Role" ADD VALUE 'UPLOADER';
  END IF;
END $$;

