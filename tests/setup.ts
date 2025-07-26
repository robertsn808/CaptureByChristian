import { beforeAll, afterAll, beforeEach } from "vitest";
import { db } from "../server/db";
import { 
  users, clients, services, bookings, contracts, invoices, 
  galleryImages, aiChats, contactMessages, clientMessages, profiles 
} from "@shared/schema";
import { sql } from "drizzle-orm";

// Test database setup and teardown
export const setupTestDatabase = () => {
  beforeAll(async () => {
    // Ensure we're using a test database
    if (!process.env.DATABASE_URL?.includes('test')) {
      throw new Error('Tests must use a test database! Set DATABASE_URL to include "test"');
    }
    
    console.log('Setting up test database...');
    
    // Drop all tables and recreate schema for clean test state
    await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
    await db.execute(sql`CREATE SCHEMA public`);
    
    // Run migrations or schema setup
    // Note: In production, you'd run your migration files here
    console.log('Test database setup complete');
  });

  afterAll(async () => {
    console.log('Cleaning up test database...');
    // Clean up test data
    await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
  });

  beforeEach(async () => {
    // Clean all tables before each test
    await Promise.all([
      db.delete(clientMessages),
      db.delete(contactMessages),
      db.delete(aiChats),
      db.delete(galleryImages),
      db.delete(invoices),
      db.delete(contracts),
      db.delete(bookings),
      db.delete(services),
      db.delete(clients),
      db.delete(profiles),
      db.delete(users),
    ]);
  });
};

// Test data factories
export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    username: `testuser_${Date.now()}`,
    password: 'hashedpassword123',
    email: `test_${Date.now()}@example.com`,
    role: 'admin' as const,
    ...overrides
  };
  
  const [user] = await db.insert(users).values(defaultUser).returning();
  return user;
};

export const createTestClient = async (overrides = {}) => {
  const defaultClient = {
    name: 'Test Client',
    email: `client_${Date.now()}@example.com`,
    phone: '+1234567890',
    notes: 'Test client for API integration',
    status: 'lead' as const,
    ...overrides
  };
  
  const [client] = await db.insert(clients).values(defaultClient).returning();
  return client;
};

export const createTestService = async (overrides = {}) => {
  const defaultService = {
    name: 'Test Photography Service',
    description: 'A test photography service',
    price: '500.00',
    duration: 120,
    category: 'portrait',
    active: true,
    ...overrides
  };
  
  const [service] = await db.insert(services).values(defaultService).returning();
  return service;
};

export const createTestBooking = async (clientId?: number, serviceId?: number, overrides = {}) => {
  if (!clientId) {
    const client = await createTestClient();
    clientId = client.id;
  }
  
  if (!serviceId) {
    const service = await createTestService();
    serviceId = service.id;
  }
  
  const defaultBooking = {
    clientId,
    serviceId,
    date: new Date(),
    duration: 120,
    location: 'Test Location',
    totalPrice: '500.00',
    status: 'pending' as const,
    ...overrides
  };
  
  const [booking] = await db.insert(bookings).values(defaultBooking).returning();
  return booking;
};

export const createTestContract = async (clientId?: number, overrides = {}) => {
  if (!clientId) {
    const client = await createTestClient();
    clientId = client.id;
  }
  
  const defaultContract = {
    clientId,
    contractType: 'individual' as const,
    serviceType: 'portrait',
    title: 'Test Photography Contract',
    templateContent: 'This is a test contract template content.',
    status: 'draft' as const,
    totalAmount: '500.00',
    ...overrides
  };
  
  const [contract] = await db.insert(contracts).values(defaultContract).returning();
  return contract;
};

export const createTestInvoice = async (bookingId?: number, overrides = {}) => {
  if (!bookingId) {
    const booking = await createTestBooking();
    bookingId = booking.id;
  }
  
  const defaultInvoice = {
    bookingId,
    amount: '500.00',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'pending' as const,
    ...overrides
  };
  
  const [invoice] = await db.insert(invoices).values(defaultInvoice).returning();
  return invoice;
};

export const createTestGalleryImage = async (bookingId?: number, overrides = {}) => {
  const defaultImage = {
    filename: `test_image_${Date.now()}.jpg`,
    originalName: 'test-image.jpg',
    url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
    category: 'test',
    featured: false,
    bookingId,
    ...overrides
  };
  
  const [image] = await db.insert(galleryImages).values(defaultImage).returning();
  return image;
};

export const createTestContactMessage = async (overrides = {}) => {
  const defaultMessage = {
    name: 'Test Contact',
    email: `contact_${Date.now()}@example.com`,
    subject: 'Test Inquiry',
    message: 'This is a test contact message',
    status: 'unread' as const,
    priority: 'normal' as const,
    source: 'website' as const,
    ...overrides
  };
  
  const [message] = await db.insert(contactMessages).values(defaultMessage).returning();
  return message;
};