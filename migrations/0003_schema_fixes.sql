-- Schema Consistency and Data Type Fixes
-- Fixes naming inconsistencies and improves data types

-- Migration: 0003_schema_fixes  
-- Created: 2025-01-20
-- Purpose: Fix schema inconsistencies and improve data types

BEGIN;

-- Fix column naming inconsistencies
-- Note: These changes may require application code updates

-- Fix typo: depost_paid -> deposit_paid
ALTER TABLE bookings RENAME COLUMN depost_paid TO deposit_paid;

-- Standardize timestamp column naming (optional - requires app changes)
-- ALTER TABLE users RENAME COLUMN createdat TO created_at;
-- ALTER TABLE clients RENAME COLUMN createdat TO created_at;  
-- ALTER TABLE bookings RENAME COLUMN createdat TO created_at;

-- Add CHECK constraints for status fields to ensure data integrity
ALTER TABLE clients ADD CONSTRAINT clients_status_check 
  CHECK (status IN ('lead', 'qualified', 'booked', 'repeat', 'archived'));

ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'));

ALTER TABLE invoices ADD CONSTRAINT invoices_status_check
  CHECK (status IN ('pending', 'paid', 'overdue'));

ALTER TABLE contracts ADD CONSTRAINT contracts_status_check  
  CHECK (status IN ('draft', 'sent', 'signed', 'completed', 'cancelled'));

-- Add email validation constraint
ALTER TABLE clients ADD CONSTRAINT clients_email_format_check
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE users ADD CONSTRAINT users_email_format_check
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add phone number validation (basic format check)
ALTER TABLE clients ADD CONSTRAINT clients_phone_format_check
  CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$');

-- Add positive amount constraints
ALTER TABLE bookings ADD CONSTRAINT bookings_positive_price_check
  CHECK (totalPrice > 0);

ALTER TABLE invoices ADD CONSTRAINT invoices_positive_amount_check  
  CHECK (amount > 0);

ALTER TABLE services ADD CONSTRAINT services_positive_price_check
  CHECK (price > 0);

-- Add foreign key cascade rules for data integrity
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_clientid_clients_id_fk;
ALTER TABLE bookings ADD CONSTRAINT bookings_clientid_clients_id_fk 
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_serviceid_services_id_fk;  
ALTER TABLE bookings ADD CONSTRAINT bookings_serviceid_services_id_fk
  FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_clientid_clients_id_fk;
ALTER TABLE contracts ADD CONSTRAINT contracts_clientid_clients_id_fk
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_bookingid_bookings_id_fk;
ALTER TABLE contracts ADD CONSTRAINT contracts_bookingid_bookings_id_fk  
  FOREIGN KEY (bookingId) REFERENCES bookings(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- Create optimized materialized view for analytics
CREATE MATERIALIZED VIEW analytics_summary AS
SELECT 
  DATE_TRUNC('month', date) as month,
  status,
  COUNT(*) as booking_count,
  SUM(totalPrice) as total_revenue,
  AVG(totalPrice) as avg_booking_value,
  COUNT(DISTINCT clientId) as unique_clients
FROM bookings 
WHERE date >= NOW() - INTERVAL '2 years'
GROUP BY DATE_TRUNC('month', date), status
ORDER BY month DESC, status;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_analytics_summary_month_status 
  ON analytics_summary(month, status);

-- Set up refresh schedule (requires pg_cron extension or manual refresh)
-- Refresh this view daily or when booking data changes significantly

COMMIT;

-- Performance and data integrity improvements applied
-- Remember to refresh materialized view: REFRESH MATERIALIZED VIEW analytics_summary;