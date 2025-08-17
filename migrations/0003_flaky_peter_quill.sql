CREATE TYPE "public"."platform" AS ENUM('screenshot', 'twitter', 'youtube');--> statement-breakpoint
ALTER TYPE "public"."plan_type" ADD VALUE 'free' BEFORE 'starter';--> statement-breakpoint
CREATE TABLE "generation" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"platform" "platform" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" text
);
--> statement-breakpoint
ALTER TABLE "generation" ADD CONSTRAINT "generation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;