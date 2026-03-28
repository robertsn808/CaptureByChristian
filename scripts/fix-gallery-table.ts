#!/usr/bin/env tsx
import { Pool } from 'pg';

async function fixGalleryTable() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 Adding missing ai_analysis column...');
    
    await pool.query(`
      ALTER TABLE gallery_images 
      ADD COLUMN IF NOT EXISTS ai_analysis JSONB;
    `);
    
    console.log('✅ ai_analysis column added successfully!');

    // Verify the column exists
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'gallery_images' 
      AND column_name = 'ai_analysis'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Column verified in database schema');
    } else {
      console.log('❌ Column still missing from database schema');
    }

  } catch (error) {
    console.error('❌ Failed to add column:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixGalleryTable();