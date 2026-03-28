#!/usr/bin/env tsx
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Read and execute SQL file
    const sqlPath = path.join(__dirname, 'create-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('🔄 Creating database tables...');
    await pool.query(sql);
    console.log('✅ Database tables created successfully');

    // Verify tables exist
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'clients', 'services', 'bookings', 'contracts', 'invoices', 'gallery_images', 'contact_messages', 'ai_chats')
      ORDER BY table_name
    `);

    console.log('📋 Created tables:');
    tableCheck.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

    // Check if admin user exists
    const userCheck = await pool.query('SELECT username FROM users WHERE username = $1', ['CapturedbyChristian']);
    if (userCheck.rows.length > 0) {
      console.log('👤 Admin user already exists');
    } else {
      console.log('👤 Admin user created');
    }

    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();