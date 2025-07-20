CREATE TABLE IF NOT EXISTS users (
  id SERIAL,
  username TEXT,
  password TEXT,
  email TEXT,
  role TEXT,
  createdAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL,
  name TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  tags TEXT,
  status TEXT,
  leadSource TEXT,
  leadScore INTEGER,
  instagramHandle TEXT,
  anniversaryDate TEXT,
  preferredCommunication TEXT,
  timezone TEXT,
  lastContact TIMESTAMP,
  nextFollowUp TIMESTAMP,
  lifetimeValue TEXT
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL,
  name TEXT,
  description TEXT,
  price TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL,
  clientId INTEGER,
  serviceId INTEGER,
  date TIMESTAMP,
  duration INTEGER,
  location TEXT,
  totalPrice TEXT
);

CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL,
  bookingId INTEGER,
  clientId INTEGER,
  contractType TEXT,
  serviceType TEXT,
  status TEXT,
  title TEXT,
  templateContent TEXT,
  signedContent TEXT,
  sessionDate TIMESTAMP,
  location TEXT,
  packageType TEXT,
  totalAmount TEXT
);

CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL,
  bookingId INTEGER,
  amount TEXT
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL,
  bookingId INTEGER,
  filename TEXT,
  originalName TEXT,
  url TEXT,
  thumbnailUrl TEXT,
  category TEXT,
  tags TEXT,
  aiAnalysis TEXT,
  featured TEXT,
  uploadedAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_chats (
  id SERIAL,
  sessionId TEXT,
  clientEmail TEXT,
  messages TEXT,
  bookingData TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL,
  clientId INTEGER,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  formData TEXT,
  score INTEGER,
  temperature TEXT,
  qualification TEXT,
  assignedTo INTEGER,
  convertedAt TIMESTAMP,
  createdAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS communication_log (
  id SERIAL,
  clientId INTEGER,
  userId INTEGER,
  type TEXT,
  direction TEXT,
  subject TEXT,
  content TEXT,
  status TEXT,
  metadata TEXT,
  scheduledFor TIMESTAMP,
  completedAt TIMESTAMP,
  createdAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS automation_sequences (
  id SERIAL,
  name TEXT,
  trigger TEXT,
  active TEXT,
  steps TEXT,
  delay TEXT,
  createdAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questionnaires (
  id SERIAL,
  name TEXT,
  description TEXT,
  serviceType TEXT,
  questions TEXT,
  id TEXT,
  active TEXT,
  createdAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_portal_sessions (
  id SERIAL,
  clientId INTEGER,
  sessionToken TEXT,
  expiresAt TIMESTAMP,
  ipAddress TEXT,
  userAgent TEXT,
  createdAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL,
  name TEXT,
  description TEXT,
  category TEXT,
  price TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL,
  clientId INTEGER,
  galleryId INTEGER,
  items TEXT,
  productId TEXT,
  subtotal TEXT
);

CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL,
  userId INTEGER,
  role TEXT,
  permissions TEXT,
  hourlyRate TEXT
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL,
  name TEXT,
  email TEXT,
  phone TEXT,
  subject TEXT,
  message TEXT,
  status TEXT,
  priority TEXT,
  source TEXT,
  ipAddress TEXT,
  userAgent TEXT,
  aiCategory TEXT,
  suggestedResponse TEXT,
  createdAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_messages (
  id SERIAL,
  clientId INTEGER,
  message TEXT,
  isFromClient TEXT,
  senderName TEXT,
  senderEmail TEXT,
  status TEXT,
  createdAt TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL,
  name TEXT,
  title TEXT,
  bio TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  headshot TEXT,
  socialMedia TEXT
);