ALTER TABLE "interactive-online-exhibition-environment_post"
  ADD COLUMN IF NOT EXISTS "status" varchar;
--> statement-breakpoint
UPDATE "interactive-online-exhibition-environment_post" AS exhibition
SET "status" = CASE
  WHEN (to_jsonb(exhibition)->>'is_archived')::boolean THEN 'archived'
  WHEN (to_jsonb(exhibition)->>'is_published')::boolean THEN 'published'
  ELSE 'draft'
END
WHERE "status" IS NULL;
--> statement-breakpoint
ALTER TABLE "interactive-online-exhibition-environment_post"
  ALTER COLUMN "status" SET DEFAULT 'draft',
  ALTER COLUMN "status" SET NOT NULL,
  DROP COLUMN IF EXISTS "is_published",
  DROP COLUMN IF EXISTS "is_archived";
