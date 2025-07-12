import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("admin"), // admin, client
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  notes: text("notes"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: integer("duration").notNull(), // minutes
  category: text("category").notNull(),
  active: boolean("active").default(true),
  addOns: json("add_ons").$type<Array<{id: string, name: string, price: number}>>(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  serviceId: integer("service_id").references(() => services.id).notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull(), // minutes
  location: text("location"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  depositPaid: boolean("deposit_paid").default(false),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  notes: text("notes"),
  addOns: json("add_ons").$type<Array<{id: string, name: string, price: number}>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  templateContent: text("template_content").notNull(),
  signedContent: text("signed_content"),
  signatureData: text("signature_data"), // base64 signature
  signedAt: timestamp("signed_at"),
  status: text("status").notNull().default("pending"), // pending, signed
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  status: text("status").notNull().default("pending"), // pending, paid, overdue
  paymentMethod: text("payment_method"),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  category: text("category"),
  tags: text("tags").array(),
  aiAnalysis: json("ai_analysis").$type<{
    emotions?: string[];
    style?: string;
    composition?: string;
    quality?: number;
  }>(),
  featured: boolean("featured").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const aiChats = pgTable("ai_chats", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  clientEmail: text("client_email"),
  messages: json("messages").$type<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>>().notNull(),
  bookingData: json("booking_data").$type<{
    serviceType?: string;
    date?: string;
    location?: string;
    budget?: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
  bookings: many(bookings),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  client: one(clients, {
    fields: [bookings.clientId],
    references: [clients.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  contract: one(contracts),
  invoice: one(invoices),
  galleryImages: many(galleryImages),
}));

export const contractsRelations = relations(contracts, ({ one }) => ({
  booking: one(bookings, {
    fields: [contracts.bookingId],
    references: [bookings.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  booking: one(bookings, {
    fields: [invoices.bookingId],
    references: [bookings.id],
  }),
}));

export const galleryImagesRelations = relations(galleryImages, ({ one }) => ({
  booking: one(bookings, {
    fields: [galleryImages.bookingId],
    references: [bookings.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
});

export const insertGalleryImageSchema = createInsertSchema(galleryImages).omit({
  id: true,
  uploadedAt: true,
});

export const insertAiChatSchema = createInsertSchema(aiChats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;

export type AiChat = typeof aiChats.$inferSelect;
export type InsertAiChat = z.infer<typeof insertAiChatSchema>;
