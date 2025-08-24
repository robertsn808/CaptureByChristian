import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { promises as fs } from "fs";
import * as path from "path";

// Get the directory name for ES modules
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DatabaseInitializer {
  private pool: Pool;
  private isInitialized = false;

  constructor(connectionString: string) {
    const isProd = String(process.env.NODE_ENV || "").toLowerCase() === "production";
    const ssl = isProd ? { rejectUnauthorized: false } : undefined;

    this.pool = new Pool({
      connectionString,
      max: 5, // Smaller pool for initialization
      connectionTimeoutMillis: 10000,
      ssl,
    });
  }

  /**
   * Ensures the database exists, creates it if it doesn't
   */
  async ensureDatabaseExists(): Promise<boolean> {
    try {
      // First try to connect to the target database
      await this.pool.query("SELECT 1");
      console.log("✅ Database connection successful");
      return true;
    } catch (error) {
      console.log(
        "⚠️ Database connection failed, attempting to create database...",
      );

      // Extract database name from connection string
      const dbUrl = new URL(process.env.DATABASE_URL!);
      const targetDbName = dbUrl.pathname.slice(1); // Remove leading slash

      // Create connection to postgres database to create our target database
      const adminConnectionString = process.env.DATABASE_URL!.replace(
        `/${targetDbName}`,
        "/postgres",
      );
      const isProd = String(process.env.NODE_ENV || "").toLowerCase() === "production";
      const ssl = isProd ? { rejectUnauthorized: false } : undefined;
      const adminPool = new Pool({
        connectionString: adminConnectionString,
        max: 1,
        connectionTimeoutMillis: 10000,
        ssl,
      });

      try {
        // Check if database exists
        const dbCheckResult = await adminPool.query(
          "SELECT 1 FROM pg_database WHERE datname = $1",
          [targetDbName],
        );

        if (dbCheckResult.rows.length === 0) {
          // Database doesn't exist, create it
          await adminPool.query(`CREATE DATABASE "${targetDbName}"`);
          console.log(`✅ Database "${targetDbName}" created successfully`);
        } else {
          console.log(`✅ Database "${targetDbName}" already exists`);
        }

        await adminPool.end();

        // Test connection again
        await this.pool.query("SELECT 1");
        console.log("✅ Database connection successful after creation");
        return true;
      } catch (createError) {
        console.error("❌ Failed to create database:", createError);
        await adminPool.end();
        return false;
      }
    }
  }

  /**
   * Runs Drizzle migrations
   */
  async runMigrations(): Promise<boolean> {
    try {
      console.log("🔄 Starting database migration process...");

      // Create drizzle instance for migrations
      const db = drizzle(this.pool);

      // Check if migrations directory exists
      const migrationsPath = path.resolve(__dirname, "../migrations");

      try {
        await fs.access(migrationsPath);
      } catch {
        console.log("⚠️ No migrations directory found, skipping migrations");
        return true;
      }

      // Run migrations
      await migrate(db, { migrationsFolder: migrationsPath });

      console.log("✅ Database migrations completed successfully");
      return true;
    } catch (error) {
      console.error("❌ Migration failed:", error);
      return false;
    }
  }

  /**
   * Test database connection and basic functionality
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.pool.query(
        "SELECT NOW() as current_time, version() as version",
      );
      console.log("✅ Database connection test successful:", {
        timestamp: result.rows[0].current_time,
        version: result.rows[0].version.split(" ")[0], // Just get PostgreSQL version
      });
      return true;
    } catch (error) {
      console.error("❌ Database connection test failed:", error);
      return false;
    }
  }

  /**
   * Check if database has initial data and seed if needed
   */
  async seedIfEmpty(): Promise<boolean> {
    try {
      console.log("🔍 Checking if database needs seeding...");
      
      // Check if we have any services
      const servicesResult = await this.pool.query("SELECT COUNT(*) FROM services");
      const servicesCount = parseInt(servicesResult.rows[0].count);
      
      // Check if we have any gallery images
      const imagesResult = await this.pool.query("SELECT COUNT(*) FROM gallery_images");
      const imagesCount = parseInt(imagesResult.rows[0].count);
      
      if (servicesCount === 0 || imagesCount === 0) {
        console.log("🌱 Database is empty, running seed script...");
        
        // Import and run seed logic inline to avoid circular dependencies
        const bcrypt = await import("bcryptjs");
        const { db } = await import("./db.ts");
        const { services, galleryImages, users } = await import("../shared/schema.ts");

        // Create admin user
        const adminPassword = await bcrypt.hash("admin123", 10);
        
        await db.insert(users).values([
          {
            username: "admin",
            email: "admin@capturedcollective.com",
            password: adminPassword,
            role: "admin"
          }
        ]).onConflictDoNothing();

        // Create photography services
        await db.insert(services).values([
          {
            name: "Wedding Photography",
            description: "Complete wedding day coverage with professional editing and online gallery",
            price: "2500.00",
            duration: 480,
            category: "wedding",
            active: true
          },
          {
            name: "Portrait Session",
            description: "Professional portrait photography for individuals and families",
            price: "350.00", 
            duration: 120,
            category: "portrait",
            active: true
          },
          {
            name: "Aerial Drone Photography",
            description: "FAA-certified drone photography for unique aerial perspectives",
            price: "500.00",
            duration: 90,
            category: "aerial",
            active: true
          },
          {
            name: "Event Photography",
            description: "Professional coverage for corporate events, parties, and celebrations",
            price: "800.00",
            duration: 240,
            category: "event", 
            active: true
          },
          {
            name: "Real Estate Photography",
            description: "High-quality interior and exterior photography for property listings",
            price: "300.00",
            duration: 60,
            category: "real_estate",
            active: true
          }
        ]).onConflictDoNothing();

        // Create sample gallery images
        await db.insert(galleryImages).values([
          {
            filename: "wedding-beach-sunset.jpg",
            originalName: "Beach Wedding Sunset",
            url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
            category: "wedding",
            featured: true,
            size: 1024000,
            mimeType: "image/jpeg"
          },
          {
            filename: "aerial-coastline.jpg", 
            originalName: "Dramatic Coastline Aerial",
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
            category: "aerial",
            featured: true,
            size: 1152000,
            mimeType: "image/jpeg"
          },
          {
            filename: "family-portrait.jpg",
            originalName: "Family Beach Portrait", 
            url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
            category: "portrait",
            featured: true,
            size: 896000,
            mimeType: "image/jpeg"
          },
          {
            filename: "luxury-home-exterior.jpg",
            originalName: "Modern Luxury Home",
            url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
            category: "real_estate",
            featured: true,
            size: 1280000,
            mimeType: "image/jpeg"
          },
          {
            filename: "corporate-event.jpg",
            originalName: "Corporate Gala Event",
            url: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800", 
            category: "event",
            featured: true,
            size: 1056000,
            mimeType: "image/jpeg"
          }
        ]).onConflictDoNothing();
        
        console.log("✅ Database seeded successfully");
      } else {
        console.log(`ℹ️ Database already has data (${servicesCount} services, ${imagesCount} images)`);
      }
      
      return true;
    } catch (error) {
      console.error("❌ Database seeding failed:", error);
      return false;
    }
  }

  /**
   * Check if required tables exist
   */
  async verifySchema(): Promise<boolean> {
    try {
      const requiredTables = [
        "users",
        "clients",
        "services",
        "bookings",
        "contracts",
        "invoices",
        "gallery_images",
        "contact_messages",
        "ai_chats",
      ];

      console.log("🔍 Verifying database schema...");

      for (const tableName of requiredTables) {
        const result = await this.pool.query(
          `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `,
          [tableName],
        );

        if (!result.rows[0].exists) {
          console.log(`⚠️ Table "${tableName}" is missing`);
          return false;
        }
      }

      console.log("✅ All required tables exist");
      return true;
    } catch (error) {
      console.error("❌ Schema verification failed:", error);
      return false;
    }
  }

  /**
   * Main initialization method
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      console.log("ℹ️ Database already initialized, skipping");
      return true;
    }

    console.log("🚀 Starting database initialization process...");

    try {
      // Step 1: Ensure database exists
      const dbExists = await this.ensureDatabaseExists();
      if (!dbExists) {
        console.error("❌ Failed to ensure database exists");
        return false;
      }

      // Step 2: Run migrations
      const migrationsSuccess = await this.runMigrations();
      if (!migrationsSuccess) {
        console.error("❌ Failed to run migrations");
        return false;
      }

      // Step 3: Test connection
      const connectionTest = await this.testConnection();
      if (!connectionTest) {
        console.error("❌ Connection test failed");
        return false;
      }

      // Step 4: Verify schema
      const schemaValid = await this.verifySchema();
      if (!schemaValid) {
        console.log(
          "⚠️ Schema verification failed, but continuing (tables may be created by migrations)",
        );
      }

      // Step 5: Seed database if empty
      const seedingSuccess = await this.seedIfEmpty();
      if (!seedingSuccess) {
        console.log("⚠️ Database seeding failed, but continuing");
      }

      this.isInitialized = true;
      console.log("🎉 Database initialization completed successfully!");
      return true;
    } catch (error) {
      console.error("❌ Database initialization failed:", error);
      return false;
    }
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    await this.pool.end();
  }

  /**
   * Get initialization status
   */
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

// Create and export a singleton instance
let dbInitializer: DatabaseInitializer | null = null;

export function getDatabaseInitializer(): DatabaseInitializer {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  if (!dbInitializer) {
    dbInitializer = new DatabaseInitializer(process.env.DATABASE_URL);
  }

  return dbInitializer;
}

/**
 * Convenience function to initialize database
 */
export async function initializeDatabase(): Promise<boolean> {
  const initializer = getDatabaseInitializer();
  return await initializer.initialize();
}
