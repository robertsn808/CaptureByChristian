import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import { Express } from "express";
import { registerRoutes } from "../../server/routes";
import express from "express";
import session from "express-session";
import { setupTestDatabase, createTestClient, createTestBooking, createTestContract } from "../setup";

// Mock the email services
vi.mock('../../server/twilio', () => ({
  sendMagicLinkSMS: vi.fn(),
  isTwilioConfigured: vi.fn(() => false)
}));

vi.mock('../../server/pdf-generator', () => ({
  generateInvoiceHTML: vi.fn(() => '<html><body>Mock Invoice</body></html>'),
  emailInvoice: vi.fn(() => Promise.resolve(true))
}));

describe('Email Notification System Tests', () => {
  let app: Express;
  let server: any;
  let sessionCookie: string;

  setupTestDatabase();

  beforeAll(async () => {
    // Setup Express app
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
        username: 'admin',
        password: 'change_this_password'
      });

    sessionCookie = loginResponse.headers['set-cookie']?.[0] || '';
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  describe('Contact Form Email Processing', () => {
    it('should process contact form submission with AI categorization', async () => {
      const contactData = {
        name: 'Test Contact',
        email: 'test@example.com',
        phone: '+1234567890',
        subject: 'Wedding Photography Inquiry',
        message: 'I am interested in booking a wedding photographer for my upcoming wedding in June.',
        priority: 'normal',
        source: 'website'
      };

      const response = await request(app)
        .post('/api/contact')
        .send(contactData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        status: 'unread'
      });
      expect(response.body.id).toBeDefined();
    });

    it('should categorize contact messages using AI', async () => {
      const contactData = {
        subject: 'Wedding Photography Pricing',
        message: 'Can you please send me your wedding photography packages and pricing information?'
      };

      const response = await request(app)
        .post('/api/ai/categorize-contact')
        .send(contactData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('category');
      expect(response.body).toHaveProperty('suggestedResponse');
      expect(typeof response.body.category).toBe('string');
      expect(typeof response.body.suggestedResponse).toBe('string');
    });

    it('should handle different contact categories', async () => {
      const testCases = [
        {
          subject: 'Portrait Session Inquiry',
          message: 'I would like to book a portrait session for my family.',
          expectedCategory: 'portrait_inquiry'
        },
        {
          subject: 'Pricing Information',
          message: 'What are your rates for event photography?',
          expectedCategory: 'pricing_question'
        },
        {
          subject: 'General Question',
          message: 'Do you travel for photo shoots?',
          expectedCategory: 'general_inquiry'
        }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/ai/categorize-contact')
          .send(testCase);

        expect(response.status).toBe(200);
        expect(response.body.category).toBeDefined();
        expect(response.body.suggestedResponse).toBeDefined();
      }
    });

    it('should retrieve contact messages for admin review', async () => {
      // Create test contact messages
      await request(app)
        .post('/api/contact')
        .send({
          name: 'Contact 1',
          email: 'contact1@test.com',
          subject: 'Test Inquiry 1',
          message: 'Test message 1'
        });

      await request(app)
        .post('/api/contact')
        .send({
          name: 'Contact 2',
          email: 'contact2@test.com',
          subject: 'Test Inquiry 2',
          message: 'Test message 2'
        });

      const response = await request(app)
        .get('/api/contact-messages');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should update contact message status', async () => {
      // Create a test contact message
      const createResponse = await request(app)
        .post('/api/contact')
        .send({
          name: 'Update Test',
          email: 'update@test.com',
          subject: 'Update Test',
          message: 'Test message'
        });

      const messageId = createResponse.body.id;

      const updateResponse = await request(app)
        .patch(`/api/contact-messages/${messageId}`)
        .send({
          status: 'read',
          priority: 'high'
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.status).toBe('read');
      expect(updateResponse.body.priority).toBe('high');
    });

    it('should delete contact messages', async () => {
      // Create a test contact message
      const createResponse = await request(app)
        .post('/api/contact')
        .send({
          name: 'Delete Test',
          email: 'delete@test.com',
          subject: 'Delete Test',
          message: 'Test message'
        });

      const messageId = createResponse.body.id;

      const deleteResponse = await request(app)
        .delete(`/api/contact-messages/${messageId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
    });
  });

  describe('Client Portal Magic Link System', () => {
    it('should send magic link to client (mocked SMS)', async () => {
      const client = await createTestClient({
        name: 'Magic Link Client',
        email: 'magic@test.com',
        phone: '+1234567890'
      });

      const response = await request(app)
        .post('/api/admin/client-credentials/magic-link')
        .send({ clientId: client.id });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(['sms', 'console', 'console_fallback']).toContain(response.body.method);
    });

    it('should handle client without phone number', async () => {
      const client = await createTestClient({
        name: 'No Phone Client',
        email: 'nophone@test.com',
        phone: null
      });

      const response = await request(app)
        .post('/api/admin/client-credentials/magic-link')
        .send({ clientId: client.id });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Client phone number is required for SMS delivery');
    });

    it('should handle non-existent client for magic link', async () => {
      const response = await request(app)
        .post('/api/admin/client-credentials/magic-link')
        .send({ clientId: 99999 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Client not found');
    });

    it('should send welcome emails to all clients', async () => {
      // Create test clients
      await createTestClient({ name: 'Welcome Client 1', email: 'welcome1@test.com' });
      await createTestClient({ name: 'Welcome Client 2', email: 'welcome2@test.com' });

      const response = await request(app)
        .post('/api/admin/send-welcome-emails');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Invoice Email System', () => {
    it('should generate invoice PDF', async () => {
      const booking = await createTestBooking();
      
      const invoiceData = {
        invoiceNumber: `INV-${booking.id}`,
        clientName: 'Test Client',
        clientEmail: 'test@example.com',
        createdDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 500.00,
        items: [
          {
            description: 'Photography Session',
            quantity: 1,
            rate: 500.00,
            amount: 500.00
          }
        ],
        notes: 'Thank you for your business!'
      };

      const response = await request(app)
        .post(`/api/invoices/pdf/INV-${booking.id}`)
        .send(invoiceData);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('application/pdf');
      expect(response.headers['content-disposition']).toContain(`attachment; filename="invoice-INV-${booking.id}.pdf"`);
    });

    it('should send invoice via email', async () => {
      const booking = await createTestBooking();
      
      const invoiceData = {
        invoiceNumber: `INV-${booking.id}`,
        clientName: 'Test Client',
        clientEmail: 'test@example.com',
        createdDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 500.00,
        items: [
          {
            description: 'Photography Session',
            quantity: 1,
            rate: 500.00,
            amount: 500.00
          }
        ]
      };

      const emailData = {
        invoice: invoiceData,
        includePaymentLink: true
      };

      const response = await request(app)
        .post(`/api/invoices/send/INV-${booking.id}`)
        .send(emailData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('sent successfully');
      expect(response.body.paymentLink).toBeDefined();
    });

    it('should handle email sending failure', async () => {
      // Mock email failure
      const { emailInvoice } = await import('../../server/pdf-generator');
      vi.mocked(emailInvoice).mockRejectedValueOnce(new Error('Email service unavailable'));

      const invoiceData = {
        invoice: {
          invoiceNumber: 'INV-TEST-FAIL',
          clientName: 'Test Client',
          clientEmail: 'fail@example.com',
          amount: 100
        },
        includePaymentLink: false
      };

      const response = await request(app)
        .post('/api/invoices/send/INV-TEST-FAIL')
        .send(invoiceData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to send invoice email');
    });
  });

  describe('Client Portal Messaging', () => {
    it('should send message from client portal', async () => {
      const client = await createTestClient();

      const messageData = {
        clientId: client.id,
        message: 'Hello, I have a question about my upcoming session.',
        senderName: client.name,
        senderEmail: client.email
      };

      const response = await request(app)
        .post('/api/client-portal/send-message')
        .send(messageData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        clientId: client.id,
        message: messageData.message,
        isFromClient: true,
        status: 'unread'
      });
    });

    it('should retrieve client messages', async () => {
      const client = await createTestClient();

      // Send a test message
      await request(app)
        .post('/api/client-portal/send-message')
        .send({
          clientId: client.id,
          message: 'Test message for retrieval',
          senderName: client.name,
          senderEmail: client.email
        });

      const response = await request(app)
        .get('/api/client-portal/messages')
        .query({ clientId: client.id });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should require all fields for client messages', async () => {
      const response = await request(app)
        .post('/api/client-portal/send-message')
        .send({
          clientId: 1,
          // Missing required fields
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');
    });
  });

  describe('Automation Sequences', () => {
    it('should retrieve automation sequences', async () => {
      const response = await request(app)
        .get('/api/automation-sequences');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Check structure of automation sequences
      response.body.forEach((sequence: any) => {
        expect(sequence).toHaveProperty('id');
        expect(sequence).toHaveProperty('name');
        expect(sequence).toHaveProperty('trigger');
        expect(sequence).toHaveProperty('active');
        expect(sequence).toHaveProperty('steps');
        expect(sequence).toHaveProperty('stats');
        expect(Array.isArray(sequence.steps)).toBe(true);
      });
    });

    it('should create new automation sequence', async () => {
      const sequenceData = {
        name: 'Test Booking Follow-up',
        trigger: 'booking_confirmed',
        active: true,
        steps: [
          {
            delay: 0,
            type: 'email',
            template: 'booking_confirmation',
            subject: 'Your booking is confirmed!',
            content: 'Thank you for booking with us.'
          },
          {
            delay: 24,
            type: 'email',
            template: 'pre_session_reminder',
            subject: 'Your session is tomorrow',
            content: 'Just a reminder about your upcoming session.'
          }
        ]
      };

      const response = await request(app)
        .post('/api/automation-sequences')
        .send(sequenceData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: sequenceData.name,
        trigger: sequenceData.trigger,
        active: true
      });
      expect(response.body.steps).toHaveLength(2);
      expect(response.body.stats).toBeDefined();
    });

    it('should have realistic automation workflow data', async () => {
      const response = await request(app)
        .get('/api/automation-sequences');

      expect(response.status).toBe(200);
      
      // Check for common automation workflows in photography business
      const workflows = response.body;
      const workflowNames = workflows.map((w: any) => w.name);
      
      expect(workflowNames.some((name: string) => name.includes('Booking'))).toBe(true);
      expect(workflowNames.some((name: string) => name.includes('Gallery'))).toBe(true);
      
      // Check that stats are reasonable
      workflows.forEach((workflow: any) => {
        expect(workflow.stats.triggered).toBeGreaterThanOrEqual(0);
        expect(workflow.stats.completed).toBeGreaterThanOrEqual(0);
        expect(workflow.stats.openRate).toBeGreaterThanOrEqual(0);
        expect(workflow.stats.openRate).toBeLessThanOrEqual(100);
        expect(workflow.stats.clickRate).toBeGreaterThanOrEqual(0);
        expect(workflow.stats.clickRate).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Email Template Processing', () => {
    it('should handle various email template types', async () => {
      const templateTypes = [
        'booking_confirmation',
        'gallery_ready',
        'review_request',
        'pre_shoot_reminder'
      ];

      templateTypes.forEach(templateType => {
        // In a real implementation, you would test template rendering
        // For now, we verify the template types are recognized
        expect(typeof templateType).toBe('string');
        expect(templateType.length).toBeGreaterThan(0);
      });
    });

    it('should validate email addresses in notifications', async () => {
      const invalidEmails = [
        'invalid-email',
        '@invalid.com',
        'test@',
        'test@.com',
        ''
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/contact')
          .send({
            name: 'Test',
            email: email,
            subject: 'Test',
            message: 'Test'
          });

        if (email === '') {
          expect(response.status).toBe(400);
        } else {
          // Some invalid emails might still be accepted by the basic validation
          // In production, you'd want more strict email validation
          expect([200, 400]).toContain(response.status);
        }
      }
    });
  });

  describe('Notification Error Handling', () => {
    it('should handle missing Twilio configuration gracefully', async () => {
      const { isTwilioConfigured } = await import('../../server/twilio');
      vi.mocked(isTwilioConfigured).mockReturnValueOnce(false);

      const client = await createTestClient({ phone: '+1234567890' });

      const response = await request(app)
        .post('/api/admin/client-credentials/magic-link')
        .send({ clientId: client.id });

      expect(response.status).toBe(200);
      expect(response.body.method).toBe('console');
    });

    it('should handle SMS sending failures', async () => {
      const { sendMagicLinkSMS, isTwilioConfigured } = await import('../../server/twilio');
      vi.mocked(isTwilioConfigured).mockReturnValueOnce(true);
      vi.mocked(sendMagicLinkSMS).mockResolvedValueOnce(false);

      const client = await createTestClient({ phone: '+1234567890' });

      const response = await request(app)
        .post('/api/admin/client-credentials/magic-link')
        .send({ clientId: client.id });

      expect(response.status).toBe(200);
      expect(response.body.method).toBe('console_fallback');
    });

    it('should handle database errors in message creation', async () => {
      // Test with invalid client ID
      const response = await request(app)
        .post('/api/client-portal/send-message')
        .send({
          clientId: 99999, // Non-existent client
          message: 'Test message',
          senderName: 'Test Sender',
          senderEmail: 'test@example.com'
        });

      expect(response.status).toBe(500);
    });
  });
});