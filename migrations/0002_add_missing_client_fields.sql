-- Safeguard migration to add any missing columns on clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS instagram_handle text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS anniversary_date text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS preferred_communication text DEFAULT 'email';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'America/New_York';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_contact timestamp;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS next_follow_up timestamp;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS lifetime_value numeric(10, 2) DEFAULT '0.00';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS referral_source text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS custom_fields json DEFAULT '{}'::json;
