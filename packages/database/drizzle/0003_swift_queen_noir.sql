ALTER TABLE "forms" ALTER COLUMN "is_protected" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "is_published" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "visibility" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "expires_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "created_at" DROP NOT NULL;