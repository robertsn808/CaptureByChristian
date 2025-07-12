import { 
  users, clients, services, bookings, contracts, invoices, galleryImages, aiChats,
  type User, type InsertUser, type Client, type InsertClient, 
  type Service, type InsertService, type Booking, type InsertBooking,
  type Contract, type InsertContract, type Invoice, type InsertInvoice,
  type GalleryImage, type InsertGalleryImage, type AiChat, type InsertAiChat
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;

  // Services
  getServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;

  // Bookings
  getBookings(): Promise<(Booking & { client: Client; service: Service })[]>;
  getBooking(id: number): Promise<(Booking & { client: Client; service: Service }) | undefined>;
  getBookingsByDateRange(start: Date, end: Date): Promise<(Booking & { client: Client; service: Service })[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking>;

  // Contracts
  getContract(bookingId: number): Promise<Contract | undefined>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract>;

  // Invoices
  getInvoice(bookingId: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice>;

  // Gallery
  getGalleryImages(): Promise<GalleryImage[]>;
  getFeaturedImages(): Promise<GalleryImage[]>;
  getImagesByBooking(bookingId: number): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, image: Partial<InsertGalleryImage>): Promise<GalleryImage>;

  // AI Chats
  getAiChat(sessionId: string): Promise<AiChat | undefined>;
  createAiChat(chat: InsertAiChat): Promise<AiChat>;
  updateAiChat(sessionId: string, chat: Partial<InsertAiChat>): Promise<AiChat>;

  // Analytics
  getMonthlyRevenue(year: number, month: number): Promise<number>;
  getBookingStats(): Promise<{
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    monthlyRevenue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Clients
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.email, email));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(insertClient).returning();
    return client;
  }

  async updateClient(id: number, updateClient: Partial<InsertClient>): Promise<Client> {
    const [client] = await db.update(clients).set(updateClient).where(eq(clients.id, id)).returning();
    return client;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.category, services.name);
  }

  async getActiveServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.active, true)).orderBy(services.category, services.name);
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async updateService(id: number, updateService: Partial<InsertService>): Promise<Service> {
    const [service] = await db.update(services).set(updateService).where(eq(services.id, id)).returning();
    return service;
  }

  // Bookings
  async getBookings(): Promise<(Booking & { client: Client; service: Service })[]> {
    return await db
      .select()
      .from(bookings)
      .leftJoin(clients, eq(bookings.clientId, clients.id))
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .orderBy(desc(bookings.date))
      .then(rows => 
        rows.map(row => ({
          ...row.bookings,
          client: row.clients!,
          service: row.services!,
        }))
      );
  }

  async getBooking(id: number): Promise<(Booking & { client: Client; service: Service }) | undefined> {
    const [result] = await db
      .select()
      .from(bookings)
      .leftJoin(clients, eq(bookings.clientId, clients.id))
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(eq(bookings.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.bookings,
      client: result.clients!,
      service: result.services!,
    };
  }

  async getBookingsByDateRange(start: Date, end: Date): Promise<(Booking & { client: Client; service: Service })[]> {
    return await db
      .select()
      .from(bookings)
      .leftJoin(clients, eq(bookings.clientId, clients.id))
      .leftJoin(services, eq(bookings.serviceId, services.id))
      .where(and(gte(bookings.date, start), lte(bookings.date, end)))
      .orderBy(bookings.date)
      .then(rows => 
        rows.map(row => ({
          ...row.bookings,
          client: row.clients!,
          service: row.services!,
        }))
      );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }

  async updateBooking(id: number, updateBooking: Partial<InsertBooking>): Promise<Booking> {
    const [booking] = await db.update(bookings).set(updateBooking).where(eq(bookings.id, id)).returning();
    return booking;
  }

  // Contracts
  async getContract(bookingId: number): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.bookingId, bookingId));
    return contract || undefined;
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const [contract] = await db.insert(contracts).values(insertContract).returning();
    return contract;
  }

  async updateContract(id: number, updateContract: Partial<InsertContract>): Promise<Contract> {
    const [contract] = await db.update(contracts).set(updateContract).where(eq(contracts.id, id)).returning();
    return contract;
  }

  // Invoices
  async getInvoice(bookingId: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.bookingId, bookingId));
    return invoice || undefined;
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    return invoice;
  }

  async updateInvoice(id: number, updateInvoice: Partial<InsertInvoice>): Promise<Invoice> {
    const [invoice] = await db.update(invoices).set(updateInvoice).where(eq(invoices.id, id)).returning();
    return invoice;
  }

  // Gallery
  async getGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(desc(galleryImages.uploadedAt));
  }

  async getFeaturedImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).where(eq(galleryImages.featured, true)).orderBy(desc(galleryImages.uploadedAt));
  }

  async getImagesByBooking(bookingId: number): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).where(eq(galleryImages.bookingId, bookingId)).orderBy(desc(galleryImages.uploadedAt));
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const [image] = await db.insert(galleryImages).values(insertImage).returning();
    return image;
  }

  async updateGalleryImage(id: number, updateImage: Partial<InsertGalleryImage>): Promise<GalleryImage> {
    const [image] = await db.update(galleryImages).set(updateImage).where(eq(galleryImages.id, id)).returning();
    return image;
  }

  // AI Chats
  async getAiChat(sessionId: string): Promise<AiChat | undefined> {
    const [chat] = await db.select().from(aiChats).where(eq(aiChats.sessionId, sessionId));
    return chat || undefined;
  }

  async createAiChat(insertChat: InsertAiChat): Promise<AiChat> {
    const [chat] = await db.insert(aiChats).values(insertChat).returning();
    return chat;
  }

  async updateAiChat(sessionId: string, updateChat: Partial<InsertAiChat>): Promise<AiChat> {
    const [chat] = await db.update(aiChats).set({
      ...updateChat,
      updatedAt: new Date(),
    }).where(eq(aiChats.sessionId, sessionId)).returning();
    return chat;
  }

  // Analytics
  async getMonthlyRevenue(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const [result] = await db
      .select({ total: sql<number>`sum(${bookings.totalPrice})` })
      .from(bookings)
      .where(
        and(
          gte(bookings.date, startDate),
          lte(bookings.date, endDate),
          eq(bookings.status, 'confirmed')
        )
      );
    
    return Number(result?.total || 0);
  }

  async getBookingStats(): Promise<{
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    monthlyRevenue: number;
  }> {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const [totalBookings] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings);

    const [pendingBookings] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.status, 'pending'));

    const [confirmedBookings] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.status, 'confirmed'));

    const monthlyRevenue = await this.getMonthlyRevenue(currentYear, currentMonth);

    return {
      totalBookings: Number(totalBookings?.count || 0),
      pendingBookings: Number(pendingBookings?.count || 0),
      confirmedBookings: Number(confirmedBookings?.count || 0),
      monthlyRevenue,
    };
  }
}

export const storage = new DatabaseStorage();
