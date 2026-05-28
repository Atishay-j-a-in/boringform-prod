CREATE TYPE "public"."visibility" AS ENUM('public', 'unlisted');--> statement-breakpoint
CREATE TYPE "public"."field_type" AS ENUM('text', 'radio', 'boolean', 'date', 'email', 'number', 'rate', 'checkbox', 'tel', 'file', 'textarea');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(80) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"profile_image_url" text,
	"salt" text,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"creator_id" uuid NOT NULL,
	"is_protected" boolean DEFAULT false,
	"password" text,
	"is_published" boolean DEFAULT true,
	"visibility" "visibility" DEFAULT 'public',
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"label" varchar(255) NOT NULL,
	"label_key" varchar(255) NOT NULL,
	"description" text,
	"placeholder" text,
	"is_required" boolean DEFAULT false,
	"index" numeric NOT NULL,
	"type" "field_type" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "fields_form_id_index_unique" UNIQUE("form_id","index")
);
--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fields" ADD CONSTRAINT "fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;