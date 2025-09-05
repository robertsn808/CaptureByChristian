-- Create all required database tables for CaptureByChristian
-- Run this SQL script directly in your PostgreSQL database

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    notes TEXT,
    tags TEXT[],
    status TEXT DEFAULT 'lead' NOT NULL,
    lead_source TEXT,
    lead_score INTEGER DEFAULT 0,
    instagram_handle TEXT,
    anniversary_date TEXT,
    preferred_communication TEXT DEFAULT 'email',
    timezone TEXT DEFAULT 'America/New_York',
    last_contact TIMESTAMP,
    next_follow_up TIMESTAMP,
    lifetime_value DECIMAL(10,2) DEFAULT 0.00,
    referral_source TEXT,
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL,
    category TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    add_ons JSONB,
    images TEXT[]
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) NOT NULL,
    service_id INTEGER REFERENCES services(id) NOT NULL,
    date TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    location TEXT,
    total_price DECIMAL(10,2) NOT NULL,
    deposit_paid BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    add_ons JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    "bookingId" INTEGER REFERENCES bookings(id),
    "clientId" INTEGER REFERENCES clients(id) NOT NULL,
    "contractType" TEXT NOT NULL,
    "serviceType" TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    title TEXT NOT NULL,
    "templateContent" TEXT NOT NULL,
    "signedContent" TEXT,
    "sessionDate" TIMESTAMP,
    location TEXT,
    "packageType" TEXT,
    "totalAmount" DECIMAL(10,2),
    "retainerAmount" DECIMAL(10,2),
    "balanceAmount" DECIMAL(10,2),
    "paymentTerms" TEXT,
    deliverables TEXT,
    timeline TEXT,
    "usageRights" TEXT,
    "cancellationPolicy" TEXT,
    "additionalTerms" TEXT,
    "clientSignature" TEXT,
    "clientSignedAt" TIMESTAMP,
    "clientIpAddress" TEXT,
    "photographerSignature" TEXT,
    "photographerSignedAt" TIMESTAMP,
    "signatureRequestSent" TIMESTAMP,
    "portalAccessToken" TEXT,
    "isFullySigned" BOOLEAN DEFAULT false,
    "signatureMetadata" JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    paid_at TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT
);

-- Gallery Images table
CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT,
    tags TEXT[],
    ai_analysis JSONB,
    featured BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Contact Messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' NOT NULL,
    priority TEXT DEFAULT 'normal' NOT NULL,
    source TEXT DEFAULT 'website' NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    ai_category TEXT DEFAULT 'general_inquiry' NOT NULL,
    suggested_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- AI Chats table
CREATE TABLE IF NOT EXISTS ai_chats (
    id SERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    client_email TEXT,
    messages JSONB NOT NULL,
    booking_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Additional tables from schema

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    source TEXT NOT NULL,
    medium TEXT,
    campaign TEXT,
    form_data JSONB,
    score INTEGER DEFAULT 0,
    temperature TEXT DEFAULT 'cold',
    qualification TEXT,
    assigned_to INTEGER REFERENCES users(id),
    converted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Communication Log table
CREATE TABLE IF NOT EXISTS communication_log (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    type TEXT NOT NULL,
    direction TEXT NOT NULL,
    subject TEXT,
    content TEXT,
    status TEXT,
    metadata JSONB,
    scheduled_for TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Client Portal Sessions table
CREATE TABLE IF NOT EXISTS client_portal_sessions (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Client Messages table
CREATE TABLE IF NOT EXISTS client_messages (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) NOT NULL,
    message TEXT NOT NULL,
    is_from_client BOOLEAN DEFAULT true NOT NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    status TEXT DEFAULT 'unread' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    headshot TEXT,
    social_media JSONB DEFAULT '{"instagram": "", "facebook": "", "youtube": ""}',
    is_active BOOLEAN DEFAULT true NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert a default admin user
INSERT INTO users (username, password, email, role) 
VALUES ('CapturedbyChristian', 'Wordpass3211', 'admin@capturedbychristian.me', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert some default services
INSERT INTO services (name, description, price, duration, category, active) VALUES
('Portrait Session', 'Professional portrait photography session', 250.00, 60, 'portrait', true),
('Wedding Photography', 'Complete wedding day photography package', 1500.00, 480, 'wedding', true),
('Event Photography', 'Corporate and social event photography', 400.00, 180, 'event', true),
('Real Estate Photography', 'Professional property photography', 300.00, 120, 'real_estate', true),
('Aerial Photography', 'Drone photography services', 500.00, 90, 'aerial', true)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_gallery_images_booking_id ON gallery_images(booking_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_ai_chats_session_id ON ai_chats(session_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to contracts table
DROP TRIGGER IF EXISTS update_contracts_updated_at ON contracts;
CREATE TRIGGER update_contracts_updated_at
    BEFORE UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();