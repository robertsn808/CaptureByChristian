ALTER TABLE "contact_messages" ADD COLUMN "ai_category" text DEFAULT 'general_inquiry' NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_messages" ADD COLUMN "suggested_response" text;