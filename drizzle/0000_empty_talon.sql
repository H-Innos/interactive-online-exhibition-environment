CREATE TABLE IF NOT EXISTS "interactive-online-exhibition-environment_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text DEFAULT '',
	"cover_image_url" varchar(512) DEFAULT '',
	"content" text DEFAULT '',
	"is_published" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_unique_idx" ON "interactive-online-exhibition-environment_post" USING btree ("name");