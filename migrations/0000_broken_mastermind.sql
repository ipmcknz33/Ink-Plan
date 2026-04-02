CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE "drawings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" text NOT NULL,
	"style_id" varchar,
	"image_url" text NOT NULL,
	"notes" text,
	"is_public" boolean DEFAULT false,
	"is_favorite" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" text NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tattoo_styles" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tags" text[] NOT NULL,
	"definition" text NOT NULL,
	"rules" text[] NOT NULL,
	"common_mistakes" text[] NOT NULL,
	"drills" text NOT NULL,
	"preview_image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"display_name" text,
	"skill_level" text DEFAULT 'Apprentice',
	"bio" text,
	"subscription_tier" text DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"style_id" varchar NOT NULL,
	"progress_percent" integer DEFAULT 0,
	"hours_practiced" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "drawings" ADD CONSTRAINT "drawings_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drawings" ADD CONSTRAINT "drawings_style_id_tattoo_styles_id_fk" FOREIGN KEY ("style_id") REFERENCES "public"."tattoo_styles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_user_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_style_id_tattoo_styles_id_fk" FOREIGN KEY ("style_id") REFERENCES "public"."tattoo_styles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "drawings_user_id_idx" ON "drawings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "drawings_style_id_idx" ON "drawings" USING btree ("style_id");--> statement-breakpoint
CREATE UNIQUE INDEX "progress_user_style_idx" ON "user_progress" USING btree ("user_id","style_id");