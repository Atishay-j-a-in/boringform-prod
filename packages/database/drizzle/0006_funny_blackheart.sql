CREATE TABLE "responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"values" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;