import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertClientSchema, insertBookingSchema, insertServiceSchema,
  insertContractSchema, insertInvoiceSchema, insertGalleryImageSchema,
  insertAiChatSchema
} from "@shared/schema";
import { z } from "zod";
import { generateBookingResponse, analyzeImage } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Client routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid client data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create client" });
      }
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(parseInt(req.params.id));
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  // Service routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getActiveServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid service data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create service" });
      }
    }
  });

  // Booking routes
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Create or find existing client
      let client = await storage.getClientByEmail(req.body.clientEmail);
      if (!client) {
        client = await storage.createClient({
          name: req.body.clientName,
          email: req.body.clientEmail,
          phone: req.body.clientPhone || null,
          notes: req.body.notes || null,
        });
      }

      // Create booking
      const booking = await storage.createBooking({
        ...bookingData,
        clientId: client.id,
      });

      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid booking data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create booking" });
      }
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(parseInt(req.params.id));
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const updateData = req.body;
      const booking = await storage.updateBooking(parseInt(req.params.id), updateData);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  // Calendar availability route
  app.get("/api/availability", async (req, res) => {
    try {
      const { start, end } = req.query;
      if (!start || !end) {
        return res.status(400).json({ error: "Start and end dates are required" });
      }

      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      
      const bookings = await storage.getBookingsByDateRange(startDate, endDate);
      
      // Return availability data
      res.json({
        bookings: bookings.map(b => ({
          id: b.id,
          date: b.date,
          duration: b.duration,
          service: b.service.name,
          client: b.client.name,
          status: b.status,
        })),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch availability" });
    }
  });

  // Contract routes
  app.get("/api/contracts/:bookingId", async (req, res) => {
    try {
      const contract = await storage.getContract(parseInt(req.params.bookingId));
      if (!contract) {
        return res.status(404).json({ error: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contract" });
    }
  });

  app.post("/api/contracts", async (req, res) => {
    try {
      const contractData = insertContractSchema.parse(req.body);
      const contract = await storage.createContract(contractData);
      res.json(contract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid contract data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create contract" });
      }
    }
  });

  app.patch("/api/contracts/:id", async (req, res) => {
    try {
      const updateData = req.body;
      const contract = await storage.updateContract(parseInt(req.params.id), updateData);
      res.json(contract);
    } catch (error) {
      res.status(500).json({ error: "Failed to update contract" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const { featured } = req.query;
      const images = featured === 'true' 
        ? await storage.getFeaturedImages()
        : await storage.getGalleryImages();
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch gallery images" });
    }
  });

  app.post("/api/gallery", async (req, res) => {
    try {
      const imageData = insertGalleryImageSchema.parse(req.body);
      
      // Analyze image with AI if URL provided
      if (imageData.url) {
        try {
          const analysis = await analyzeImage(imageData.url);
          imageData.aiAnalysis = analysis;
        } catch (error) {
          console.error("AI analysis failed:", error);
        }
      }

      const image = await storage.createGalleryImage(imageData);
      res.json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid image data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create gallery image" });
      }
    }
  });

  // AI Chat routes
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const { sessionId, message, clientEmail } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ error: "Session ID and message are required" });
      }

      // Get or create chat session
      let chat = await storage.getAiChat(sessionId);
      
      if (!chat) {
        chat = await storage.createAiChat({
          sessionId,
          clientEmail: clientEmail || null,
          messages: [],
          bookingData: {},
        });
      }

      // Add user message
      const messages = [
        ...chat.messages,
        {
          role: 'user' as const,
          content: message,
          timestamp: Date.now(),
        }
      ];

      // Generate AI response
      const aiResponse = await generateBookingResponse(messages, chat.bookingData);
      
      // Add AI response
      messages.push({
        role: 'assistant' as const,
        content: aiResponse.message,
        timestamp: Date.now(),
      });

      // Update chat
      await storage.updateAiChat(sessionId, {
        messages,
        bookingData: { ...chat.bookingData, ...aiResponse.bookingData },
        clientEmail: clientEmail || chat.clientEmail,
      });

      res.json({
        message: aiResponse.message,
        bookingData: aiResponse.bookingData,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process AI chat" });
    }
  });

  app.get("/api/ai-chat/:sessionId", async (req, res) => {
    try {
      const chat = await storage.getAiChat(req.params.sessionId);
      if (!chat) {
        return res.status(404).json({ error: "Chat session not found" });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat session" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/stats", async (req, res) => {
    try {
      const stats = await storage.getBookingStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.get("/api/analytics/revenue/:year/:month", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      const revenue = await storage.getMonthlyRevenue(year, month);
      res.json({ revenue });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revenue data" });
    }
  });

  // Invoice routes
  app.get("/api/invoices/:bookingId", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(parseInt(req.params.bookingId));
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(invoiceData);
      res.json(invoice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid invoice data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create invoice" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
