-- Add fields to store payment and external references for invoices
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_number text;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS stripe_session_id text;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS stripe_payment_intent text;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS stripe_checkout_url text;
