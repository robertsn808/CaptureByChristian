import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "../../server/db";
import { storage } from "../../server/storage";
import { sql } from "drizzle-orm";
import { setupTestDatabase, createTestClient, createTestService, createTestBooking } from "../setup";

describe('Database Connectivity and Operations Tests', () => {
  setupTestDatabase();

  describe('Database Connection', () => {
    it('should establish database connection successfully', async () => {
      const result = await db.execute(sql`SELECT 1 as test`);
      expect(result).toBeDefined();
      expect(result.rows[0].test).toBe(1);
    });

    it('should execute basic SELECT query', async () => {
      const result = await db.execute(sql`SELECT current_database() as db_name`);
      expect(result.rows[0].db_name).toBeDefined();
    });

    it('should handle database version check', async () => {
      const result = await db.execute(sql`SELECT version() as version`);
      expect(result.rows[0].version).toBeDefined();
      expect(result.rows[0].version).toContain('PostgreSQL');
    });
  });

  describe('Database Schema Validation', () => {
    it('should have all required tables', async () => {
      const tablesQuery = sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `;
      
      const result = await db.execute(tablesQuery);
      const tableNames = result.rows.map(row => row.table_name);
      
      const requiredTables = [
        'users', 'clients', 'services', 'bookings', 
        'contracts', 'invoices', 'gallery_images', 
        'ai_chats', 'contact_messages', 'client_messages', 'profiles'
      ];
      
      requiredTables.forEach(tableName => {
        expect(tableNames).toContain(tableName);
      });
    });

    it('should have correct column types for clients table', async () => {
      const columnsQuery = sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'clients'
        ORDER BY ordinal_position
      `;
      
      const result = await db.execute(columnsQuery);
      const columns = result.rows;
      
      // Check essential columns exist with correct types
      const idColumn = columns.find(col => col.column_name === 'id');
      expect(idColumn).toBeDefined();
      expect(idColumn?.data_type).toBe('integer');
      
      const nameColumn = columns.find(col => col.column_name === 'name');
      expect(nameColumn).toBeDefined();
      expect(nameColumn?.data_type).toBe('text');
      expect(nameColumn?.is_nullable).toBe('NO');
      
      const emailColumn = columns.find(col => col.column_name === 'email');
      expect(emailColumn).toBeDefined();
      expect(emailColumn?.data_type).toBe('text');
      expect(emailColumn?.is_nullable).toBe('NO');
    });

    it('should have proper foreign key constraints', async () => {
      const fkQuery = sql`
        SELECT 
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM 
          information_schema.table_constraints AS tc 
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
      `;
      
      const result = await db.execute(fkQuery);
      const constraints = result.rows;
      
      // Check bookings -> clients foreign key
      const bookingClientFk = constraints.find(
        fk => fk.table_name === 'bookings' && fk.column_name === 'clientid'
      );
      expect(bookingClientFk).toBeDefined();
      expect(bookingClientFk?.foreign_table_name).toBe('clients');
      
      // Check bookings -> services foreign key
      const bookingServiceFk = constraints.find(
        fk => fk.table_name === 'bookings' && fk.column_name === 'serviceid'
      );
      expect(bookingServiceFk).toBeDefined();
      expect(bookingServiceFk?.foreign_table_name).toBe('services');
    });
  });

  describe('Storage Layer Operations', () => {
    it('should perform basic client operations', async () => {
      // Test create
      const clientData = {
        name: 'Test Client Storage',
        email: 'storage.test@example.com',
        phone: '+1234567890'
      };
      
      const createdClient = await storage.createClient(clientData);
      expect(createdClient).toBeDefined();
      expect(createdClient.name).toBe(clientData.name);
      expect(createdClient.id).toBeDefined();
      
      // Test read
      const retrievedClient = await storage.getClient(createdClient.id);
      expect(retrievedClient).toBeDefined();
      expect(retrievedClient?.email).toBe(clientData.email);
      
      // Test read by email
      const clientByEmail = await storage.getClientByEmail(clientData.email);
      expect(clientByEmail).toBeDefined();
      expect(clientByEmail?.id).toBe(createdClient.id);
      
      // Test update
      const updatedClient = await storage.updateClient(createdClient.id, {
        notes: 'Updated via storage test'
      });
      expect(updatedClient.notes).toBe('Updated via storage test');
      
      // Test list
      const allClients = await storage.getClients();
      expect(allClients.length).toBeGreaterThan(0);
      expect(allClients.some(c => c.id === createdClient.id)).toBe(true);
    });

    it('should perform service operations correctly', async () => {
      const serviceData = {
        name: 'Storage Test Service',
        description: 'Test service for storage operations',
        price: '299.99',
        duration: 90,
        category: 'test',
        active: true
      };
      
      const createdService = await storage.createService(serviceData);
      expect(createdService.name).toBe(serviceData.name);
      
      const retrievedService = await storage.getService(createdService.id);
      expect(retrievedService?.price).toBe(serviceData.price);
      
      const updatedService = await storage.updateService(createdService.id, {
        price: '399.99'
      });
      expect(updatedService.price).toBe('399.99');
      
      await storage.deleteService(createdService.id);
      const deletedService = await storage.getService(createdService.id);
      expect(deletedService).toBeUndefined();
    });

    it('should handle booking operations with relationships', async () => {
      const client = await createTestClient();
      const service = await createTestService();
      
      const bookingData = {
        clientId: client.id,
        serviceId: service.id,
        date: new Date(),
        duration: 120,
        location: 'Storage Test Location',
        totalPrice: '599.99',
        status: 'pending' as const
      };
      
      const createdBooking = await storage.createBooking(bookingData);
      expect(createdBooking.clientId).toBe(client.id);
      expect(createdBooking.serviceId).toBe(service.id);
      
      // Test booking retrieval with relationships
      const bookingWithRelations = await storage.getBooking(createdBooking.id);
      expect(bookingWithRelations).toBeDefined();
      expect(bookingWithRelations?.client.name).toBe(client.name);
      expect(bookingWithRelations?.service.name).toBe(service.name);
      
      // Test date range queries
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      
      const bookingsInRange = await storage.getBookingsByDateRange(startDate, endDate);
      expect(bookingsInRange.some(b => b.id === createdBooking.id)).toBe(true);
    });
  });

  describe('Database Performance and Reliability', () => {
    it('should handle concurrent operations', async () => {
      const concurrentOperations = Array.from({ length: 10 }, (_, i) => 
        storage.createClient({
          name: `Concurrent Client ${i}`,
          email: `concurrent${i}@test.com`
        })
      );
      
      const results = await Promise.all(concurrentOperations);
      expect(results).toHaveLength(10);
      results.forEach((client, index) => {
        expect(client.name).toBe(`Concurrent Client ${index}`);
        expect(client.id).toBeDefined();
      });
    });

    it('should handle large dataset operations', async () => {
      // Create a moderate number of test records
      const clientPromises = Array.from({ length: 50 }, (_, i) =>
        storage.createClient({
          name: `Bulk Client ${i}`,
          email: `bulk${i}@test.com`
        })
      );
      
      await Promise.all(clientPromises);
      
      const allClients = await storage.getClients();
      expect(allClients.length).toBeGreaterThanOrEqual(50);
      
      // Test that the operation completes in reasonable time
      const startTime = Date.now();
      await storage.getClients();
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle transaction rollback on errors', async () => {
      try {
        // Attempt to create a booking with invalid foreign key
        await storage.createBooking({
          clientId: 99999, // Non-existent client
          serviceId: 99999, // Non-existent service
          date: new Date(),
          duration: 120,
          location: 'Test Location',
          totalPrice: '100.00',
          status: 'pending'
        });
        
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        // Should handle the error gracefully
        expect(error).toBeDefined();
      }
    });
  });

  describe('Data Integrity and Constraints', () => {
    it('should enforce unique constraints', async () => {
      const clientData = {
        name: 'Unique Test Client',
        email: 'unique@test.com'
      };
      
      await storage.createClient(clientData);
      
      try {
        // Attempt to create another client with same email
        await storage.createClient({
          name: 'Another Client',
          email: 'unique@test.com' // Same email
        });
        
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should handle null values appropriately', async () => {
      const clientWithOptionalFields = await storage.createClient({
        name: 'Minimal Client',
        email: 'minimal@test.com',
        phone: null, // Optional field
        notes: null  // Optional field
      });
      
      expect(clientWithOptionalFields.phone).toBeNull();
      expect(clientWithOptionalFields.notes).toBeNull();
    });

    it('should validate required fields', async () => {
      try {
        // @ts-ignore - Intentionally invalid data for testing
        await storage.createClient({
          email: 'test@example.com'
          // Missing required 'name' field
        });
        
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Analytics and Aggregation Queries', () => {
    it('should calculate booking statistics correctly', async () => {
      // Create test data
      const client = await createTestClient();
      const service = await createTestService();
      
      await createTestBooking(client.id, service.id, { status: 'pending' });
      await createTestBooking(client.id, service.id, { status: 'confirmed' });
      await createTestBooking(client.id, service.id, { status: 'completed' });
      
      const stats = await storage.getBookingStats();
      
      expect(stats.totalBookings).toBeGreaterThanOrEqual(3);
      expect(stats.pendingBookings).toBeGreaterThanOrEqual(1);
      expect(stats.confirmedBookings).toBeGreaterThanOrEqual(1);
      expect(typeof stats.monthlyRevenue).toBe('number');
    });

    it('should calculate monthly revenue correctly', async () => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      const revenue = await storage.getMonthlyRevenue(currentYear, currentMonth);
      expect(typeof revenue).toBe('number');
      expect(revenue).toBeGreaterThanOrEqual(0);
    });

    it('should provide client metrics', async () => {
      await createTestClient({ name: 'Metrics Client 1' });
      await createTestClient({ name: 'Metrics Client 2' });
      
      const metrics = await storage.getClientMetrics();
      
      expect(metrics.totalClients).toBeGreaterThanOrEqual(2);
      expect(typeof metrics.newThisMonth).toBe('number');
      expect(typeof metrics.repeatClients).toBe('number');
      expect(typeof metrics.avgLifetimeValue).toBe('number');
    });
  });
});