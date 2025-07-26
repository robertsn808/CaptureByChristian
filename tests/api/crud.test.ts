import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { Express } from "express";
import { registerRoutes } from "../../server/routes";
import express from "express";
import session from "express-session";
import { setupTestDatabase, createTestClient, createTestService, createTestBooking, createTestContract, createTestUser } from "../setup";

describe('CRUD Operations API Integration Tests', () => {
  let app: Express;
  let server: any;
  let sessionCookie: string;

  setupTestDatabase();

  beforeAll(async () => {
    // Setup Express app with same middleware as production
    app = express();
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true }));
    
    // Setup session middleware for authentication
    app.use(session({
      secret: 'test-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: false, // false for test environment
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
      }
    }));

    server = await registerRoutes(app);

    // Create test admin user and authenticate
    const testUser = await createTestUser({
      username: 'testadmin',
      password: 'testpassword',
      email: 'admin@test.com'
    });

    // Login and get session cookie
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testadmin',
        password: 'testpassword'
      });

    expect(loginResponse.status).toBe(200);
    sessionCookie = loginResponse.headers['set-cookie'][0];
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('Client CRUD Operations', () => {
    it('should create a new client', async () => {
      const clientData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        notes: 'New client from API test'
      };

      const response = await request(app)
        .post('/api/clients')
        .set('Cookie', sessionCookie)
        .send(clientData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      });
      expect(response.body.id).toBeDefined();
    });

    it('should retrieve all clients', async () => {
      // Create test clients
      await createTestClient({ name: 'Client 1', email: 'client1@test.com' });
      await createTestClient({ name: 'Client 2', email: 'client2@test.com' });

      const response = await request(app)
        .get('/api/clients')
        .set('Cookie', sessionCookie);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should retrieve a specific client by ID', async () => {
      const testClient = await createTestClient({ name: 'Specific Client' });

      const response = await request(app)
        .get(`/api/clients/${testClient.id}`)
        .set('Cookie', sessionCookie);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testClient.id);
      expect(response.body.name).toBe('Specific Client');
    });

    it('should return 404 for non-existent client', async () => {
      const response = await request(app)
        .get('/api/clients/99999')
        .set('Cookie', sessionCookie);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Client not found');
    });

    it('should validate client data on creation', async () => {
      const invalidClientData = {
        // Missing required name field
        email: 'invalid@test.com'
      };

      const response = await request(app)
        .post('/api/clients')
        .set('Cookie', sessionCookie)
        .send(invalidClientData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid client data');
    });
  });

  describe('Service CRUD Operations', () => {
    it('should create a new service', async () => {
      const serviceData = {
        name: 'Wedding Photography',
        description: 'Full day wedding photography service',
        price: '1500.00',
        duration: 480,
        category: 'wedding',
        active: true
      };

      const response = await request(app)
        .post('/api/services')
        .send(serviceData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: 'Wedding Photography',
        price: '1500.00',
        category: 'wedding'
      });
    });

    it('should retrieve all active services', async () => {
      await createTestService({ name: 'Active Service', active: true });
      await createTestService({ name: 'Inactive Service', active: false });

      const response = await request(app)
        .get('/api/services');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Should only return active services
      response.body.forEach((service: any) => {
        expect(service.active).toBe(true);
      });
    });

    it('should update a service', async () => {
      const testService = await createTestService({ name: 'Original Service' });

      const updateData = {
        name: 'Updated Service Name',
        price: '750.00'
      };

      const response = await request(app)
        .patch(`/api/services/${testService.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Service Name');
      expect(response.body.price).toBe('750.00');
    });

    it('should delete a service', async () => {
      const testService = await createTestService();

      const response = await request(app)
        .delete(`/api/services/${testService.id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should retrieve all services for admin', async () => {
      await createTestService({ name: 'Active Admin Service', active: true });
      await createTestService({ name: 'Inactive Admin Service', active: false });

      const response = await request(app)
        .get('/api/services/admin');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Should return both active and inactive services
      const hasActive = response.body.some((s: any) => s.active === true);
      const hasInactive = response.body.some((s: any) => s.active === false);
      expect(hasActive && hasInactive).toBe(true);
    });
  });

  describe('Booking CRUD Operations', () => {
    it('should create a new booking', async () => {
      const client = await createTestClient();
      const service = await createTestService();

      const bookingData = {
        serviceId: service.id.toString(),
        date: new Date().toISOString(),
        location: 'Test Venue',
        totalPrice: '500.00',
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        notes: 'Test booking'
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        clientId: client.id,
        serviceId: service.id,
        location: 'Test Venue',
        totalPrice: '500.00'
      });
    });

    it('should retrieve all bookings', async () => {
      await createTestBooking();
      await createTestBooking();

      const response = await request(app)
        .get('/api/bookings');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should retrieve a specific booking by ID', async () => {
      const testBooking = await createTestBooking();

      const response = await request(app)
        .get(`/api/bookings/${testBooking.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testBooking.id);
    });

    it('should update a booking', async () => {
      const testBooking = await createTestBooking();

      const updateData = {
        status: 'confirmed',
        notes: 'Updated booking notes'
      };

      const response = await request(app)
        .patch(`/api/bookings/${testBooking.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('confirmed');
      expect(response.body.notes).toBe('Updated booking notes');
    });

    it('should handle invalid service ID in booking creation', async () => {
      const bookingData = {
        serviceId: '99999',
        date: new Date().toISOString(),
        location: 'Test Venue',
        totalPrice: '500.00',
        clientName: 'Test Client',
        clientEmail: 'test@example.com'
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid service ID');
    });
  });

  describe('Contract CRUD Operations', () => {
    it('should create a new contract', async () => {
      const client = await createTestClient();

      const contractData = {
        clientId: client.id,
        contractType: 'individual',
        serviceType: 'portrait',
        title: 'Portrait Photography Contract',
        templateContent: 'Contract template content here...',
        totalAmount: '800.00'
      };

      const response = await request(app)
        .post('/api/contracts')
        .send(contractData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        clientId: client.id,
        title: 'Portrait Photography Contract',
        status: 'draft'
      });
    });

    it('should retrieve all contracts', async () => {
      await createTestContract();
      await createTestContract();

      const response = await request(app)
        .get('/api/contracts');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should retrieve a specific contract by ID', async () => {
      const testContract = await createTestContract();

      const response = await request(app)
        .get(`/api/contracts/${testContract.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testContract.id);
    });

    it('should update a contract', async () => {
      const testContract = await createTestContract();

      const updateData = {
        status: 'sent',
        additionalTerms: 'Updated contract terms'
      };

      const response = await request(app)
        .put(`/api/contracts/${testContract.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('sent');
      expect(response.body.additionalTerms).toBe('Updated contract terms');
    });

    it('should send contract to client portal', async () => {
      const testContract = await createTestContract();

      const response = await request(app)
        .post(`/api/contracts/${testContract.id}/send`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.portalLink).toBeDefined();
    });
  });

  describe('Authentication Required Endpoints', () => {
    it('should require authentication for protected client routes', async () => {
      const response = await request(app)
        .get('/api/clients');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should allow access with valid session', async () => {
      const response = await request(app)
        .get('/api/clients')
        .set('Cookie', sessionCookie);

      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // This would require mocking database connection failures
      // For now, we test that errors return proper HTTP status codes
      const response = await request(app)
        .get('/api/clients/invalid-id')
        .set('Cookie', sessionCookie);

      expect(response.status).toBe(500);
    });

    it('should validate JSON input', async () => {
      const response = await request(app)
        .post('/api/clients')
        .set('Cookie', sessionCookie)
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });
  });
});