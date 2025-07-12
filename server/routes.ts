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
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients", details: error.message });
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
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings", details: error.message });
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

  // Real-time analytics endpoint
  app.get("/api/analytics/realtime", async (req, res) => {
    try {
      const [bookings, clients, galleryImages] = await Promise.all([
        storage.getBookings(),
        storage.getClients(),
        storage.getGalleryImages()
      ]);

      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Calculate actual real-time metrics
      const recentBookings = bookings.filter(b => new Date(b.createdAt) >= oneHourAgo);
      const todayBookings = bookings.filter(b => new Date(b.createdAt) >= oneDayAgo);
      const recentClients = clients.filter(c => new Date(c.createdAt) >= oneDayAgo);
      
      const realTimeData = {
        activeVisitors: Math.floor(Math.random() * 8) + 2, // Simulated live visitors
        pageViews: 45 + Math.floor(Math.random() * 25), // Base + variation
        newBookings: recentBookings.length,
        totalBookings: bookings.length,
        newClients: recentClients.length,
        totalClients: clients.length,
        portfolioViews: galleryImages.length * 3 + Math.floor(Math.random() * 20),
        avgSessionDuration: "2:34",
        bounceRate: 28 + Math.floor(Math.random() * 10),
        topPages: [
          { page: "/", views: 45 + Math.floor(Math.random() * 20), percentage: 35 },
          { page: "/portfolio", views: 32 + Math.floor(Math.random() * 15), percentage: 28 },
          { page: "/services", views: 18 + Math.floor(Math.random() * 10), percentage: 22 },
          { page: "/contact", views: 12 + Math.floor(Math.random() * 8), percentage: 15 }
        ],
        recentActivity: [
          { action: "New booking inquiry", client: recentClients[0]?.name || "Anonymous", time: "2 min ago" },
          { action: "Portfolio gallery viewed", client: "Visitor from Honolulu", time: "5 min ago" },
          { action: "Service page visited", client: "Visitor from Maui", time: "8 min ago" },
          { action: "Contact form submitted", client: recentClients[1]?.name || "Anonymous", time: "12 min ago" }
        ],
        trafficSources: [
          { source: "Direct", visitors: 12, percentage: 45 },
          { source: "Google", visitors: 8, percentage: 30 },
          { source: "Social Media", visitors: 4, percentage: 15 },
          { source: "Referrals", visitors: 3, percentage: 10 }
        ],
        deviceTypes: [
          { type: "Mobile", count: 15, percentage: 60 },
          { type: "Desktop", count: 8, percentage: 32 },
          { type: "Tablet", count: 2, percentage: 8 }
        ],
        locations: [
          { city: "Honolulu", state: "HI", visitors: 8 },
          { city: "Maui", state: "HI", visitors: 5 },
          { city: "Kona", state: "HI", visitors: 3 },
          { city: "Hilo", state: "HI", visitors: 2 },
          { city: "Los Angeles", state: "CA", visitors: 2 }
        ]
      };

      res.json(realTimeData);
    } catch (error) {
      console.error("Error fetching real-time analytics:", error);
      res.status(500).json({ error: "Failed to fetch real-time analytics" });
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

  // Client Portal Authentication Routes
  app.post("/api/client-portal/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Find client by email
      const client = await storage.getClientByEmail(email);
      if (!client) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // In a real app, you'd verify password hash
      // For demo purposes, we'll accept any password
      
      res.json({
        id: client.id,
        name: client.name,
        email: client.email,
        token: `client_${client.id}_${Date.now()}` // Simple token for demo
      });
    } catch (error) {
      console.error("Client login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/client-portal/magic-link", async (req, res) => {
    try {
      const { email } = req.body;
      
      const client = await storage.getClientByEmail(email);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      
      // In a real app, you'd send an email with a secure token
      // For demo purposes, we'll just return success
      console.log(`Magic link would be sent to: ${email}`);
      
      res.json({ message: "Magic link sent" });
    } catch (error) {
      console.error("Magic link error:", error);
      res.status(500).json({ error: "Failed to send magic link" });
    }
  });

  app.get("/api/client-portal/bookings", async (req, res) => {
    try {
      const clientId = parseInt(req.query.clientId as string);
      const bookings = await storage.getBookings();
      const clientBookings = bookings.filter(b => b.clientId === clientId);
      
      res.json(clientBookings);
    } catch (error) {
      console.error("Error fetching client bookings:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/client-portal/galleries", async (req, res) => {
    try {
      const clientId = parseInt(req.query.clientId as string);
      
      // Mock gallery data - in real app, fetch from database
      const galleries = [
        {
          id: "1",
          name: "Wedding - Beach Ceremony",
          clientId: clientId,
          status: "proofing",
          coverImage: "/api/placeholder/400/300",
          photoCount: 156,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "2", 
          name: "Engagement Session",
          clientId: clientId,
          status: "ready_for_download",
          coverImage: "/api/placeholder/400/300",
          photoCount: 89,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      res.json(galleries);
    } catch (error) {
      console.error("Error fetching client galleries:", error);
      res.status(500).json({ error: "Failed to fetch galleries" });
    }
  });

  app.get("/api/client-portal/gallery/:galleryId", async (req, res) => {
    try {
      const { galleryId } = req.params;
      
      // Mock gallery with images
      const gallery = {
        id: galleryId,
        name: galleryId === "1" ? "Wedding - Beach Ceremony" : "Engagement Session",
        status: galleryId === "1" ? "proofing" : "ready_for_download",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        images: Array.from({ length: 12 }, (_, i) => ({
          id: `img_${galleryId}_${i + 1}`,
          url: `/api/placeholder/800/600?random=${galleryId}_${i}`,
          thumbnailUrl: `/api/placeholder/300/300?random=${galleryId}_${i}`,
          filename: `IMG_${String(i + 1).padStart(4, '0')}.jpg`
        }))
      };
      
      res.json(gallery);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      res.status(500).json({ error: "Failed to fetch gallery" });
    }
  });

  app.get("/api/client-portal/selections/:galleryId", async (req, res) => {
    try {
      const { galleryId } = req.params;
      const clientId = req.query.clientId;
      
      // Mock existing selections
      const selections = {
        galleryId,
        clientId,
        favorites: ["img_1_3", "img_1_7", "img_1_12"],
        comments: {
          "img_1_3": "Love this shot of the ceremony!",
          "img_1_7": "Perfect lighting here"
        }
      };
      
      res.json(selections);
    } catch (error) {
      console.error("Error fetching selections:", error);
      res.status(500).json({ error: "Failed to fetch selections" });
    }
  });

  app.post("/api/client-portal/selections/:galleryId", async (req, res) => {
    try {
      const { galleryId } = req.params;
      const { clientId, favorites, comments } = req.body;
      
      // In a real app, save to database
      console.log(`Saving selections for gallery ${galleryId}, client ${clientId}:`, {
        favorites: favorites.length,
        comments: Object.keys(comments).length
      });
      
      res.json({ message: "Selections saved successfully" });
    } catch (error) {
      console.error("Error saving selections:", error);
      res.status(500).json({ error: "Failed to save selections" });
    }
  });

  app.get("/api/client-portal/contracts", async (req, res) => {
    try {
      const clientId = parseInt(req.query.clientId as string);
      
      // Mock contract data
      const contracts = [
        {
          id: 1,
          clientId: clientId,
          title: "Wedding Photography Contract",
          signedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          downloadUrl: "/api/contracts/wedding-contract.pdf"
        }
      ];
      
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ error: "Failed to fetch contracts" });
    }
  });

  // ===== Invoice PDF & Email Routes =====
  app.post("/api/invoices/pdf/:invoiceNumber", async (req, res) => {
    try {
      const { invoiceNumber } = req.params;
      const invoiceData = req.body;
      
      // Import PDF generator
      const { generateInvoiceHTML } = await import("./pdf-generator");
      
      // Convert invoice data to proper format
      const pdfData = {
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceDate: invoiceData.createdDate,
        dueDate: invoiceData.dueDate,
        clientName: invoiceData.clientName,
        clientEmail: invoiceData.clientEmail,
        items: invoiceData.items,
        subtotal: invoiceData.amount,
        total: invoiceData.amount,
        notes: invoiceData.notes
      };
      
      const html = generateInvoiceHTML(pdfData);
      
      // In production, you would convert HTML to PDF here using puppeteer or similar
      // For now, we'll return the HTML as a simulated PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceNumber}.pdf"`);
      res.send(html);
      
    } catch (error) {
      console.error("PDF generation error:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });

  app.post("/api/invoices/send/:invoiceNumber", async (req, res) => {
    try {
      const { invoiceNumber } = req.params;
      const { invoice, includePaymentLink } = req.body;
      
      // Import email functionality
      const { emailInvoice } = await import("./pdf-generator");
      
      // Convert invoice data
      const emailData = {
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.createdDate,
        dueDate: invoice.dueDate,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        items: invoice.items,
        subtotal: invoice.amount,
        total: invoice.amount,
        notes: invoice.notes
      };
      
      // Generate PDF and send email (mock implementation)
      const success = await emailInvoice(emailData, "");
      
      if (success) {
        res.json({ 
          success: true, 
          message: `Invoice ${invoiceNumber} sent successfully to ${invoice.clientEmail}`,
          paymentLink: includePaymentLink ? `https://pay.christianpicaso.com/invoice/${invoiceNumber}` : null
        });
      } else {
        res.status(500).json({ error: "Failed to send email" });
      }
      
    } catch (error) {
      console.error("Email send error:", error);
      res.status(500).json({ error: "Failed to send invoice email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}