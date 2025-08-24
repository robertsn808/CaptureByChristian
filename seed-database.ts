#!/usr/bin/env tsx
import dotenv from "dotenv";
dotenv.config();

import { db } from "./server/db.ts";
import { services, galleryImages, users } from "./shared/schema.ts";
import bcrypt from "bcryptjs";

async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  try {
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

    console.log("✅ Admin user created");

    // Create photography services
    await db.insert(services).values([
      {
        name: "Wedding Photography",
        description: "Complete wedding day coverage with professional editing and online gallery",
        price: "2500.00",
        duration: 480, // 8 hours
        category: "wedding",
        active: true
      },
      {
        name: "Portrait Session",
        description: "Professional portrait photography for individuals and families",
        price: "350.00", 
        duration: 120, // 2 hours
        category: "portrait",
        active: true
      },
      {
        name: "Aerial Drone Photography",
        description: "FAA-certified drone photography for unique aerial perspectives",
        price: "500.00",
        duration: 90, // 1.5 hours
        category: "aerial",
        active: true
      },
      {
        name: "Event Photography",
        description: "Professional coverage for corporate events, parties, and celebrations",
        price: "800.00",
        duration: 240, // 4 hours
        category: "event", 
        active: true
      },
      {
        name: "Real Estate Photography",
        description: "High-quality interior and exterior photography for property listings",
        price: "300.00",
        duration: 60, // 1 hour
        category: "real_estate",
        active: true
      }
    ]).onConflictDoNothing();

    console.log("✅ Photography services created");

    // Create sample gallery images using Unsplash
    await db.insert(galleryImages).values([
      {
        filename: "wedding-beach-sunset.jpg",
        original_name: "Beach Wedding Sunset",
        url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "wedding",
        featured: true
      },
      {
        filename: "aerial-coastline.jpg", 
        original_name: "Dramatic Coastline Aerial",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "aerial",
        featured: true
      },
      {
        filename: "family-portrait.jpg",
        original_name: "Family Beach Portrait", 
        url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "portrait",
        featured: true
      },
      {
        filename: "luxury-home-exterior.jpg",
        original_name: "Modern Luxury Home",
        url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "real_estate",
        featured: true
      },
      {
        filename: "corporate-event.jpg",
        original_name: "Corporate Gala Event",
        url: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800", 
        category: "event",
        featured: true
      },
      {
        filename: "engagement-session.jpg",
        original_name: "Romantic Engagement Session",
        url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "portrait", 
        featured: false
      },
      {
        filename: "sunset-drone-shot.jpg",
        original_name: "Golden Hour Aerial Shot",
        url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "aerial",
        featured: false
      },
      {
        filename: "interior-design.jpg",
        original_name: "Luxury Interior Design",
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        category: "real_estate",
        featured: false
      }
    ]).onConflictDoNothing();

    console.log("✅ Sample gallery images created");
    console.log("🎉 Database seeding completed successfully!");

  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log("✅ Seed process completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed process failed:", error);
    process.exit(1);
  });