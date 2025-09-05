import { Pool } from 'pg';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleSqlite } from 'drizzle-orm/sqlite-proxy';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

let db: any;
let pool: any;

if (process.env.DATABASE_URL.startsWith('sqlite://')) {
  db = drizzleSqlite(async (sql, params, method) => {
    try {
      const rows = await new Promise((resolve, reject) => {
        const sqlite3 = require('sqlite3').verbose();
        const db = new sqlite3.Database(process.env.DATABASE_URL.replace('sqlite://', ''));
        db.all(sql, params, (err: any, rows: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
        db.close();
      });
      return { rows };
    } catch (e: any) {
      console.error('Error from sqlite proxy:', e.message);
      return { rows: [] };
    }
  }, { schema });
} else {
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: { rejectUnauthorized: false }
  });
  db = drizzleNode(pool, { schema });
}

export { db, pool };