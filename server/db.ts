import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";
import "dotenv/config";

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set.");
}

const isProduction = process.env.NODE_ENV === "production";
const connectionString = process.env.DATABASE_URL;

// Configure PostgreSQL pool
const pool = new Pool(
  isProduction
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false }, // Required by most managed DBs like Render/Neon
      }
    : {
        connectionString, // No SSL locally
      }
);

// Initialize Drizzle with schema
export const db = drizzle(pool, { schema });
