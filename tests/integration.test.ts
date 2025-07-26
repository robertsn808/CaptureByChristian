import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { Express } from "express";
import { registerRoutes } from "../server/routes";
import express from "express";
import session from "express-session";
import { setupTestDatabase, createTestClient, createTestService, createTestBooking, createTestContract } from "./setup";

describe('Backend API Integration Tests - End to End', () => {
  let app: Express;
  let server: any;
  let sessionCookie: string;

  setupTestDatabase();

  beforeAll(async () => {
    // Setup Express app with production-like configuration
    app = express();
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    app.use(session({
      secret: 'test-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
      }
    }));

    server = await registerRoutes(app);

    // Authenticate for protected routes
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'change_this_password'
      });

    if (loginResponse.status === 200) {
      sessionCookie = loginResponse.headers['set-cookie']?.[0] || '';
    }
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('Complete Photography Business Workflow', () => {
    it('should handle full client booking lifecycle', async () => {
      // 1. Create a service
      const serviceData = {
        name: 'Wedding Photography Package',
        description: 'Complete wedding day photography',
        price: '2500.00',
        duration: 480, // 8 hours
        category: 'wedding',
        active: true
      };

      const serviceResponse = await request(app)
        .post('/api/services')
        .send(serviceData);

      expect(serviceResponse.status).toBe(200);
      const service = serviceResponse.body;

      // 2. Create a booking (which creates a client automatically)
      const bookingData = {
        serviceId: service.id.toString(),
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        location: 'Hawaii Beach Resort',
        totalPrice: '2500.00',
        clientName: 'John & Jane Smith',
        clientEmail: 'smith.wedding@example.com',
        clientPhone: '+1-555-WEDDING',
        notes: 'Beach ceremony at sunset, reception follows',
        status: 'pending'
      };

      const bookingResponse = await request(app)
        .post('/api/bookings')
        .send(bookingData);

      expect(bookingResponse.status).toBe(200);
      const booking = bookingResponse.body;
      expect(booking.clientId).toBeDefined();

      // 3. Retrieve the created client
      const clientResponse = await request(app)
        .get(`/api/clients/${booking.clientId}`)
        .set('Cookie', sessionCookie);

      expect(clientResponse.status).toBe(200);
      const client = clientResponse.body;
      expect(client.email).toBe('smith.wedding@example.com');

      // 4. Create a contract for the booking
      const contractData = {
        clientId: client.id,
        bookingId: booking.id,
        contractType: 'individual',
        serviceType: 'wedding',
        title: 'Wedding Photography Contract - Smith Wedding',
        templateContent: `
          This agreement is between CaptureByChristian and ${client.name} 
          for wedding photography services on ${new Date(booking.date).toLocaleDateString()}.
          
          Service Details:
          - Event: Wedding Photography
          - Date: ${new Date(booking.date).toLocaleDateString()}
          - Location: ${booking.location}
          - Duration: ${service.duration} minutes
          - Total Amount: $${booking.totalPrice}
          
          Terms and Conditions:
          1. 50% deposit required to secure booking
          2. Final images delivered within 4-6 weeks
          3. High-resolution digital gallery included
          4. Travel within 30 miles of Honolulu included
        `,
        totalAmount: booking.totalPrice,
        retainerAmount: '1250.00',
        balanceAmount: '1250.00',
        paymentTerms: '50% deposit required, balance due 7 days before event',
        deliverables: '200-300 edited high-resolution digital images',
        timeline: '4-6 weeks delivery',
        usageRights: 'Personal use and social media sharing permitted',
        cancellationPolicy: '48 hours notice required, deposits non-refundable'
      };

      const contractResponse = await request(app)
        .post('/api/contracts')
        .send(contractData);

      expect(contractResponse.status).toBe(200);
      const contract = contractResponse.body;

      // 5. Send contract to client portal
      const sendContractResponse = await request(app)
        .post(`/api/contracts/${contract.id}/send`);

      expect(sendContractResponse.status).toBe(200);
      expect(sendContractResponse.body.success).toBe(true);
      expect(sendContractResponse.body.portalLink).toBeDefined();

      // 6. Update booking status to confirmed
      const updateBookingResponse = await request(app)
        .patch(`/api/bookings/${booking.id}`)
        .send({ status: 'confirmed' });

      expect(updateBookingResponse.status).toBe(200);
      expect(updateBookingResponse.body.status).toBe('confirmed');

      // 7. Create invoice for the booking
      const invoiceResponse = await request(app)
        .post('/api/invoices')
        .send({ bookingId: booking.id });

      expect(invoiceResponse.status).toBe(200);
      const invoice = invoiceResponse.body;

      // 8. Upload sample gallery images
      const testImageBuffer = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0xFF, 0xD9
      ]);

      const uploadResponse = await request(app)
        .post('/api/gallery/upload')
        .attach('images', testImageBuffer, 'wedding-sample-1.jpg')
        .attach('images', testImageBuffer, 'wedding-sample-2.jpg')
        .field('category', 'wedding')
        .field('bookingId', booking.id.toString());

      expect(uploadResponse.status).toBe(200);
      expect(uploadResponse.body.images).toHaveLength(2);

      // 9. Verify the complete workflow created all related data
      const finalBookingResponse = await request(app)
        .get(`/api/bookings/${booking.id}`);

      expect(finalBookingResponse.status).toBe(200);
      expect(finalBookingResponse.body.client.name).toBe('John & Jane Smith');
      expect(finalBookingResponse.body.service.name).toBe('Wedding Photography Package');

      // 10. Test analytics endpoints work with the created data
      const statsResponse = await request(app)
        .get('/api/analytics/stats');

      expect(statsResponse.status).toBe(200);
      expect(statsResponse.body.totalBookings).toBeGreaterThan(0);
      expect(statsResponse.body.confirmedBookings).toBeGreaterThan(0);
    });

    it('should handle client portal workflow', async () => {
      // Create test client and booking
      const client = await createTestClient({
        name: 'Portal Test Client',
        email: 'portal@test.com'
      });

      const booking = await createTestBooking(client.id);

      // 1. Test client portal login (mock)
      const loginResponse = await request(app)
        .post('/api/client-portal/login')
        .send({
          email: client.email,
          password: 'any-password' // Demo accepts any password
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.email).toBe(client.email);

      // 2. Get client bookings
      const bookingsResponse = await request(app)
        .get('/api/client-portal/bookings')
        .query({ clientId: client.id });

      expect(bookingsResponse.status).toBe(200);
      expect(Array.isArray(bookingsResponse.body)).toBe(true);

      // 3. Get client galleries
      const galleriesResponse = await request(app)
        .get('/api/client-portal/galleries')
        .query({ clientId: client.id });

      expect(galleriesResponse.status).toBe(200);
      expect(Array.isArray(galleriesResponse.body)).toBe(true);

      // 4. Send a message from client portal
      const messageResponse = await request(app)
        .post('/api/client-portal/send-message')
        .send({
          clientId: client.id,
          message: 'When will my photos be ready?',
          senderName: client.name,
          senderEmail: client.email
        });

      expect(messageResponse.status).toBe(200);
      expect(messageResponse.body.isFromClient).toBe(true);

      // 5. Get client messages
      const messagesResponse = await request(app)
        .get('/api/client-portal/messages')
        .query({ clientId: client.id });

      expect(messagesResponse.status).toBe(200);
      expect(Array.isArray(messagesResponse.body)).toBe(true);
      expect(messagesResponse.body.length).toBeGreaterThan(0);
    });

    it('should handle admin dashboard analytics and management', async () => {
      // Create test data
      await createTestClient({ name: 'Analytics Client 1' });
      await createTestClient({ name: 'Analytics Client 2' });
      await createTestBooking();
      await createTestBooking();

      // 1. Test real-time analytics
      const realtimeResponse = await request(app)
        .get('/api/analytics/realtime');

      expect(realtimeResponse.status).toBe(200);
      expect(realtimeResponse.body).toHaveProperty('totalBookings');
      expect(realtimeResponse.body).toHaveProperty('totalClients');
      expect(realtimeResponse.body).toHaveProperty('recentActivity');
      expect(Array.isArray(realtimeResponse.body.recentActivity)).toBe(true);

      // 2. Test business KPIs
      const kpiResponse = await request(app)
        .get('/api/analytics/business-kpis');

      expect(kpiResponse.status).toBe(200);
      expect(kpiResponse.body).toHaveProperty('totalClients');
      expect(kpiResponse.body).toHaveProperty('totalBookings');
      expect(kpiResponse.body).toHaveProperty('completionRate');

      // 3. Test client metrics
      const clientMetricsResponse = await request(app)
        .get('/api/analytics/clients');

      expect(clientMetricsResponse.status).toBe(200);
      expect(clientMetricsResponse.body).toHaveProperty('totalClients');
      expect(clientMetricsResponse.body).toHaveProperty('newThisMonth');

      // 4. Test client credentials management
      const credentialsResponse = await request(app)
        .get('/api/admin/client-credentials');

      expect(credentialsResponse.status).toBe(200);
      expect(Array.isArray(credentialsResponse.body)).toBe(true);

      // 5. Test automation sequences
      const automationResponse = await request(app)
        .get('/api/automation-sequences');

      expect(automationResponse.status).toBe(200);
      expect(Array.isArray(automationResponse.body)).toBe(true);
      expect(automationResponse.body.length).toBeGreaterThan(0);
    });
  });

  describe('API Performance and Reliability', () => {
    it('should handle high concurrency requests', async () => {
      const concurrentRequests = 20;
      const promises = Array.from({ length: concurrentRequests }, (_, i) =>
        request(app)
          .post('/api/contact')
          .send({
            name: `Concurrent Contact ${i}`,
            email: `concurrent${i}@test.com`,
            subject: `Concurrent Test ${i}`,
            message: `This is concurrent request number ${i}`
          })
      );

      const results = await Promise.all(promises);
      
      results.forEach((result, index) => {
        expect(result.status).toBe(200);
        expect(result.body.name).toBe(`Concurrent Contact ${index}`);
      });
    });

    it('should maintain data consistency under load', async () => {
      // Create multiple bookings simultaneously
      const service = await createTestService();
      const client = await createTestClient();

      const bookingPromises = Array.from({ length: 10 }, (_, i) =>
        request(app)
          .post('/api/bookings')
          .send({
            serviceId: service.id.toString(),
            date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
            location: `Location ${i}`,
            totalPrice: service.price,
            clientName: client.name,
            clientEmail: client.email,
            notes: `Concurrent booking ${i}`
          })
      );

      const results = await Promise.all(bookingPromises);
      
      results.forEach((result, index) => {
        expect(result.status).toBe(200);
        expect(result.body.location).toBe(`Location ${index}`);
      });

      // Verify all bookings were created
      const allBookingsResponse = await request(app)
        .get('/api/bookings');

      expect(allBookingsResponse.status).toBe(200);
      expect(allBookingsResponse.body.length).toBeGreaterThanOrEqual(10);
    });

    it('should handle API rate limiting gracefully', async () => {
      // Send many requests in quick succession
      const rapidRequests = Array.from({ length: 100 }, () =>
        request(app)
          .get('/api/services')
          .timeout(5000)
      );

      const results = await Promise.allSettled(rapidRequests);
      
      // Most requests should succeed, but some may be rate limited
      const successfulRequests = results.filter(r => r.status === 'fulfilled' && (r.value as any).status === 200);
      
      expect(successfulRequests.length).toBeGreaterThan(50); // At least 50% should succeed
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/contact')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json"}');

      expect(response.status).toBe(400);
    });

    it('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({
          // Missing required fields
          date: new Date().toISOString()
        });

      expect(response.status).toBe(400);
    });

    it('should handle non-existent resource requests', async () => {
      const responses = await Promise.all([
        request(app).get('/api/clients/99999').set('Cookie', sessionCookie),
        request(app).get('/api/services/99999'),
        request(app).get('/api/bookings/99999'),
        request(app).get('/api/contracts/99999')
      ]);

      responses.forEach(response => {
        expect([404, 500]).toContain(response.status);
      });
    });

    it('should handle authentication properly', async () => {
      // Test protected routes without authentication
      const protectedRoutes = [
        '/api/clients',
        '/api/clients/1'
      ];

      for (const route of protectedRoutes) {
        const response = await request(app).get(route);
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Authentication required');
      }
    });
  });

  describe('Health Check and Monitoring', () => {
    it('should provide health check endpoint', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should handle system status checks', async () => {
      // Test multiple endpoints to ensure system is operational
      const healthChecks = await Promise.all([
        request(app).get('/api/health'),
        request(app).get('/api/services'),
        request(app).get('/api/gallery'),
        request(app).post('/api/ai/categorize-contact').send({
          subject: 'Health Check',
          message: 'System test'
        })
      ]);

      healthChecks.forEach((check, index) => {
        expect(check.status).toBeLessThan(500);
      });
    });
  });
});