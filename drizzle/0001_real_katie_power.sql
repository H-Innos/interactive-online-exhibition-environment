CREATE TABLE IF NOT EXISTS "interactive-online-exhibition-environment_answer" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" serial NOT NULL,
	"text" varchar(256) NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interactive-online-exhibition-environment_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "interactive-online-exhibition-environment_category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interactive-online-exhibition-environment_exhibition_category" (
	"exhibition_id" serial NOT NULL,
	"category_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interactive-online-exhibition-environment_question" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_id" serial NOT NULL,
	"text" varchar(256) NOT NULL,
	"image" varchar(512) DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interactive-online-exhibition-environment_quiz" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"exhibition_id" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "interactive-online-exhibition-environment_post" ADD COLUMN "background_color" varchar(7) DEFAULT '#FFFFFF';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interactive-online-exhibition-environment_answer" ADD CONSTRAINT "interactive-online-exhibition-environment_answer_question_id_interactive-online-exhibition-environment_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."interactive-online-exhibition-environment_question"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interactive-online-exhibition-environment_exhibition_category" ADD CONSTRAINT "interactive-online-exhibition-environment_exhibition_category_exhibition_id_interactive-online-exhibition-environment_post_id_fk" FOREIGN KEY ("exhibition_id") REFERENCES "public"."interactive-online-exhibition-environment_post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interactive-online-exhibition-environment_exhibition_category" ADD CONSTRAINT "interactive-online-exhibition-environment_exhibition_category_category_id_interactive-online-exhibition-environment_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."interactive-online-exhibition-environment_category"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interactive-online-exhibition-environment_question" ADD CONSTRAINT "interactive-online-exhibition-environment_question_quiz_id_interactive-online-exhibition-environment_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."interactive-online-exhibition-environment_quiz"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interactive-online-exhibition-environment_quiz" ADD CONSTRAINT "interactive-online-exhibition-environment_quiz_exhibition_id_interactive-online-exhibition-environment_post_id_fk" FOREIGN KEY ("exhibition_id") REFERENCES "public"."interactive-online-exhibition-environment_post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
