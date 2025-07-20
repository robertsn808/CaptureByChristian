import { 
  users, clients, services, bookings, contracts, invoices, galleryImages, aiChats, contactMessages, clientPortalSessions, clientMessages, profiles,
  type User, type InsertUser, type Client, type InsertClient, 
  type Service, type InsertService, type Booking, type InsertBooking,
  type Contract, type InsertContract, type Invoice, type InsertInvoice,
  type GalleryImage, type InsertGalleryImage, type AiChat, type InsertAiChat,
  type ContactMessage, type InsertContactMessage, type ClientMessage, type InsertClientMessage,
  type Profile, type InsertProfile
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { type PgTable, type PgColumn } from "drizzle-orm/pg-core";

// Base CRUD operations for reusability
abstract class BaseRepository<T, TInsert> {
  constructor(protected table: any, protected idColumn: any) {}

  async findById(id: number): Promise<T | undefined> {
    const [result] = await db.select().from(this.table).where(eq(this.idColumn, id));
    return result || undefined;
  }

  async findAll(): Promise<T[]> {
    return await db.select().from(this.table);
  }

  async create(data: TInsert): Promise<T> {
    const [result] = await db.insert(this.table).values(data).returning();
    return result;
  }

  async update(id: number, data: Partial<TInsert>): Promise<T> {
    const [result] = await db.update(this.table).set(data).where(eq(this.idColumn, id)).returning();
    return result;
  }

  async delete(id: number): Promise<void> {
    await db.delete(this.table).where(eq(this.idColumn, id));
  }

  protected async handleError<R>(operation: () => Promise<R>, fallback: R): Promise<R> {
    try {
      return await operation();
    } catch (error) {
      console.error(`Database operation failed:`, error);
      return fallback;
    }
  }
}

// Analytics types
interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  monthlyRevenue: number;
}

interface InvoiceStats {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  paymentRate: number;
}

interface BusinessKPIs {
  monthlyRecurringRevenue: number;
  totalClients: number;
  totalBookings: number;
  completionRate: number;
}

interface ClientMetrics {
  totalClients: number;
  newThisMonth: number;
  repeatClients: number;
  avgLifetimeValue: number;
}

interface ClientPortalStats {
  activeUsers: number;
  totalSessions: number;
  totalLogins: number;
  accessRate: string;
  avgSessionTime: string;
  topActivity: string;
  downloadCount: number;
  paymentCount: number;
  avgRating: string | number;
}

// Service interfaces
interface IUserService {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

interface IClientService {
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  getClientMessages(clientId: number): Promise<ClientMessage[]>;
  createClientMessage(message: InsertClientMessage): Promise<ClientMessage>;
}

interface IServiceService {
  getServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;
}

interface IBookingService {
  getBookings(): Promise<(Booking & { client: Client; service: Service })[]>;
  getBooking(id: number): Promise<(Booking & { client: Client; service: Service }) | undefined>;
  getBookingsByDateRange(start: Date, end: Date): Promise<(Booking & { client: Client; service: Service })[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking>;
}

interface IContractService {
  getContracts(): Promise<(Contract & { client: Client })[]>;
  getContract(id: number): Promise<(Contract & { client: Client }) | undefined>;
  getContractByBooking(bookingId: number): Promise<Contract | undefined>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract>;
  sendContractToPortal(contractId: number): Promise<{ success: boolean; portalLink?: string }>;
}

interface IInvoiceService {
  getInvoice(bookingId: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<InsertInvoice>): Promise<Invoice>;
}

interface IGalleryService {
  getGalleryImages(): Promise<GalleryImage[]>;
  getFeaturedImages(): Promise<GalleryImage[]>;
  getImagesByBooking(bookingId: number): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;
  updateGalleryImage(id: number, image: Partial<InsertGalleryImage>): Promise<GalleryImage>;
  deleteGalleryImage(id: number): Promise<void>;
}

interface IAiChatService {
  getAiChat(sessionId: string): Promise<AiChat | undefined>;
  createAiChat(chat: InsertAiChat): Promise<AiChat>;
  updateAiChat(sessionId: string, chat: Partial<InsertAiChat>): Promise<AiChat>;
}

interface IAnalyticsService {
  getMonthlyRevenue(year: number, month: number): Promise<number>;
  getBookingStats(): Promise<BookingStats>;
  getInvoiceStats(): Promise<InvoiceStats>;
  getBusinessKPIs(): Promise<BusinessKPIs>;
  getClientMetrics(): Promise<ClientMetrics>;
}

interface IContactService {
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: number, message: Partial<InsertContactMessage>): Promise<ContactMessage>;
  deleteContactMessage(id: number): Promise<void>;
}

interface IProfileService {
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profile: Partial<InsertProfile>): Promise<Profile>;
  createProfile(profile: InsertProfile): Promise<Profile>;
}

interface IClientPortalService {
  getClientPortalStats(): Promise<ClientPortalStats>;
}

export interface IStorage extends 
  IUserService,
  IClientService, 
  IServiceService,
  IBookingService,
  IContractService,
  IInvoiceService,
  IGalleryService,
  IAiChatService,
  IAnalyticsService,
  IContactService,
  IProfileService,
  IClientPortalService {}

// Individual service implementations
class UserService extends BaseRepository<User, InsertUser> implements IUserService {
  constructor() {
    super(users, users.id);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.findById(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return this.create(insertUser);
  }
}

class ClientService extends BaseRepository<Client, InsertClient> implements IClientService {
  constructor() {
    super(clients, clients.id);
  }

  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.findById(id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.email, email));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    return this.create(insertClient);
  }

  async updateClient(id: number, updateClient: Partial<InsertClient>): Promise<Client> {
    return this.update(id, updateClient);
  }

  async getClientMessages(clientId: number): Promise<ClientMessage[]> {
    const messages = await db.select().from(clientMessages)
      .where(eq(clientMessages.clientId, clientId))
      .orderBy(desc(clientMessages.createdAt));
    return messages;
  }

  async createClientMessage(insertMessage: InsertClientMessage): Promise<ClientMessage> {
    const [message] = await db.insert(clientMessages).values(insertMessage).returning();
    return message;
  }
}

class ServiceService extends BaseRepository<Service, InsertService> implements IServiceService {
  constructor() {
    super(services, services.id);
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.category, services.name);
  }

  async getActiveServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.active, true)).orderBy(services.category, services.name);
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.findById(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    return this.create(insertService);
  }

  async updateService(id: number, updateService: Partial<InsertService>): Promise<Service> {
    return this.update(id, updateService);
  }

  async deleteService(id: number): Promise<void> {
    return this.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  private userService = new UserService();
  private clientService = new ClientService();
  private serviceService = new ServiceService();

  protected async handleError<R>(operation: () => Promise<R>, fallback: R): Promise<R> {
    try {
      return await operation();
    } catch (error) {
      console.error(`Database operation failed:`, error);
      return fallback;
    }
  }

  // User methods - delegate to UserService
  async getUser(id: number): Promise<User | undefined> {
    return this.userService.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.userService.getUserByUsername(username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return this.userService.createUser(insertUser);
  }

  // Client methods - delegate to ClientService
  async getClients(): Promise<Client[]> {
    return this.clientService.getClients();
  }

  async getClient(id: number): Promise<Client | undefined> {
    return this.clientService.getClient(id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return this.clientService.getClientByEmail(email);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    return this.clientService.createClient(insertClient);
  }

  async updateClient(id: number, updateClient: Partial<InsertClient>): Promise<Client> {
    return this.clientService.updateClient(id, updateClient);
  }

  async getClientMessages(clientId: number): Promise<ClientMessage[]> {
    return this.clientService.getClientMessages(clientId);
  }

  async createClientMessage(insertMessage: InsertClientMessage): Promise<ClientMessage> {
    return this.clientService.createClientMessage(insertMessage);
  }

  // Service methods - delegate to ServiceService
  async getServices(): Promise<Service[]> {
    return this.serviceService.getServices();
  }

  async getActiveServices(): Promise<Service[]> {
    return this.serviceService.getActiveServices();
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.serviceService.getService(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    return this.serviceService.createService(insertService);
  }

  async updateService(id: number, updateService: Partial<InsertService>): Promise<Service> {
    return this.serviceService.updateService(id, updateService);
  }

  async deleteService(id: number): Promise<void> {
    return this.serviceService.deleteService(id);
  }

  // Bookings
  async getBookings(): Promise<(Booking & { client: Client; service: Service })[]> {
    return this.handleError(async () => {
      return await db
        .select({
          booking: bookings,
          client: clients,
          service: services
        })
        .from(bookings)
        .leftJoin(clients, eq(bookings.clientId, clients.id))
        .leftJoin(services, eq(bookings.serviceId, services.id))
        .orderBy(desc(bookings.date))
        .then(rows => 
          rows.map(row => ({
            ...row.booking,
            client: row.client!,
            service: row.service!,
          }))
        );
    }, []);
  }

  async getBooking(id: number): Promise<(Booking & { client: Client; service: Service }) | undefined> {
    return this.handleError(async () => {
      const [result] = await db
        .select({
          booking: bookings,
          client: clients,
          service: services
        })
        .from(bookings)
        .leftJoin(clients, eq(bookings.clientId, clients.id))
        .leftJoin(services, eq(bookings.serviceId, services.id))
        .where(eq(bookings.id, id));
      
      if (!result) return undefined;
      
      return {
        ...result.booking,
        client: result.client!,
        service: result.service!,
      };
    }, undefined);
  }

  async getBookingsByDateRange(start: Date, end: Date): Promise<(Booking & { client: Client; service: Service })[]> {
    return this.handleError(async () => {
      return await db
        .select({
          booking: bookings,
          client: clients,
          service: services
        })
        .from(bookings)
        .leftJoin(clients, eq(bookings.clientId, clients.id))
        .leftJoin(services, eq(bookings.serviceId, services.id))
        .where(and(gte(bookings.date, start), lte(bookings.date, end)))
        .orderBy(bookings.date)
        .then(rows => 
          rows.map(row => ({
            ...row.booking,
            client: row.client!,
            service: row.service!,
          }))
        );
    }, []);
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
  async getContracts(): Promise<(Contract & { client: Client })[]> {
    return this.handleError(async () => {
      const contractsData = await db
        .select({
          contract: contracts,
          client: clients
        })
        .from(contracts)
        .leftJoin(clients, eq(contracts.clientId, clients.id))
        .orderBy(desc(contracts.createdAt));
      
      return contractsData.map(row => ({
        ...row.contract,
        client: row.client!
      }));
    }, []);
  }

  async getContract(id: number): Promise<(Contract & { client: Client }) | undefined> {
    return this.handleError(async () => {
      const [contractData] = await db
        .select({
          contract: contracts,
          client: clients
        })
        .from(contracts)
        .leftJoin(clients, eq(contracts.clientId, clients.id))
        .where(eq(contracts.id, id));
      
      if (!contractData) return undefined;
      
      return {
        ...contractData.contract,
        client: contractData.client!
      };
    }, undefined);
  }

  async getContractByBooking(bookingId: number): Promise<Contract | undefined> {
    return this.handleError(async () => {
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.bookingId, bookingId));
      return contract || undefined;
    }, undefined);
  }



  async createContract(insertContract: InsertContract): Promise<Contract> {
    const [contract] = await db
      .insert(contracts)
      .values(insertContract)
      .returning();
    return contract;
  }

  async updateContract(id: number, updateContract: Partial<InsertContract>): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({ ...updateContract, updatedAt: new Date() })
      .where(eq(contracts.id, id))
      .returning();
    return contract;
  }

  async sendContractToPortal(contractId: number): Promise<{ success: boolean; portalLink?: string }> {
    // Generate a secure token for client portal access
    const portalToken = `contract_${contractId}_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    // Update contract with portal token and sent timestamp
    await db
      .update(contracts)
      .set({
        status: 'sent',
        portalAccessToken: portalToken,
        signatureRequestSent: new Date(),
        updatedAt: new Date()
      })
      .where(eq(contracts.id, contractId));
    
    // Create portal link
    const portalLink = `${process.env.REPLIT_DOMAINS || 'localhost:3000'}/client-portal/contract/${portalToken}`;
    
    return {
      success: true,
      portalLink
    };
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
    return this.handleError(async () => {
      return await db.select().from(galleryImages).orderBy(desc(galleryImages.uploadedAt));
    }, []);
  }

  async getFeaturedImages(): Promise<GalleryImage[]> {
    return this.handleError(async () => {
      return await db.select().from(galleryImages).where(eq(galleryImages.featured, true)).orderBy(desc(galleryImages.uploadedAt));
    }, []);
  }

  async getImagesByBooking(bookingId: number): Promise<GalleryImage[]> {
    return this.handleError(async () => {
      return await db.select().from(galleryImages).where(eq(galleryImages.bookingId, bookingId)).orderBy(desc(galleryImages.uploadedAt));
    }, []);
  }

  async createGalleryImage(insertImage: InsertGalleryImage): Promise<GalleryImage> {
    const [image] = await db.insert(galleryImages).values(insertImage).returning();
    return image;
  }

  async updateGalleryImage(id: number, updateImage: Partial<InsertGalleryImage>): Promise<GalleryImage> {
    const [image] = await db.update(galleryImages).set(updateImage).where(eq(galleryImages.id, id)).returning();
    return image;
  }

  async deleteGalleryImage(id: number): Promise<void> {
    await db.delete(galleryImages).where(eq(galleryImages.id, id));
  }

  // AI Chats
  async getAiChat(sessionId: string): Promise<AiChat | undefined> {
    return this.handleError(async () => {
      const [chat] = await db.select().from(aiChats).where(eq(aiChats.sessionId, sessionId));
      return chat || undefined;
    }, undefined);
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
    return this.handleError(async () => {
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
    }, 0);
  }

  async getBookingStats(): Promise<BookingStats> {
    return this.handleError(async () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      const [totalBookings, pendingBookings, confirmedBookings] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(bookings),
        db.select({ count: sql<number>`count(*)` }).from(bookings).where(eq(bookings.status, 'pending')),
        db.select({ count: sql<number>`count(*)` }).from(bookings).where(eq(bookings.status, 'confirmed'))
      ]);

      const monthlyRevenue = await this.getMonthlyRevenue(currentYear, currentMonth);

      return {
        totalBookings: Number(totalBookings[0]?.count || 0),
        pendingBookings: Number(pendingBookings[0]?.count || 0),
        confirmedBookings: Number(confirmedBookings[0]?.count || 0),
        monthlyRevenue,
      };
    }, {
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      monthlyRevenue: 0
    });
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return this.handleError(async () => {
      return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
    }, []);
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.handleError(async () => {
      const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
      return message || undefined;
    }, undefined);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(insertMessage).returning();
    return message;
  }

  async updateContactMessage(id: number, updateMessage: Partial<InsertContactMessage>): Promise<ContactMessage> {
    const [message] = await db.update(contactMessages)
      .set(updateMessage)
      .where(eq(contactMessages.id, id))
      .returning();
    return message;
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  // Client Portal Stats
  async getClientPortalStats(): Promise<ClientPortalStats> {
    return this.handleError(async () => {
      const allSessions = await db.select().from(clientPortalSessions);
      const activeSessions = allSessions.filter(s => s.status === 'active');
      
      const totalLogins = allSessions.length;
      
      const totalClientsResult = await db.select({ count: sql<number>`count(*)` }).from(clients);
      const totalClients = totalClientsResult[0]?.count || 0;
      const accessRate = totalClients > 0 ? Math.round((activeSessions.length / totalClients) * 100) : 0;
      
      const downloadCount = allSessions.reduce((sum, session) => {
        const activities = session.activityLog || [];
        return sum + activities.filter((activity: any) => activity.type === 'download').length;
      }, 0);
      
      const sessionsWithRatings = allSessions.filter(s => s.rating && s.rating > 0);
      const avgRating = sessionsWithRatings.length > 0 
        ? (sessionsWithRatings.reduce((sum, s) => sum + (s.rating || 0), 0) / sessionsWithRatings.length).toFixed(1)
        : "No ratings yet";

      return {
        activeUsers: activeSessions.length,
        totalSessions: totalLogins,
        totalLogins: totalLogins,
        accessRate: `${accessRate}%`,
        avgSessionTime: "0:00",
        topActivity: downloadCount > 0 ? "Photo downloads" : "Gallery viewing",
        downloadCount: downloadCount,
        paymentCount: 0,
        avgRating: avgRating
      };
    }, {
      activeUsers: 0,
      totalSessions: 0,
      totalLogins: 0,
      accessRate: "0%",
      avgSessionTime: "0:00",
      topActivity: "No activity",
      downloadCount: 0,
      paymentCount: 0,
      avgRating: "No ratings yet"
    });
  }

  // Invoice Analytics
  async getInvoiceStats(): Promise<InvoiceStats> {
    return this.handleError(async () => {
      const allBookings = await db.select().from(bookings);
      
      const completedBookings = allBookings.filter(b => b.status === 'completed');
      const totalRevenue = completedBookings.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0);
      
      return {
        totalRevenue,
        pendingAmount: 0,
        overdueAmount: 0,
        paymentRate: completedBookings.length > 0 ? 100 : 0
      };
    }, {
      totalRevenue: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      paymentRate: 0
    });
  }

  async getBusinessKPIs(): Promise<BusinessKPIs> {
    return this.handleError(async () => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      const [totalClients, totalBookings, completedBookings] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(clients),
        db.select({ count: sql<number>`count(*)` }).from(bookings),
        db.select({ count: sql<number>`count(*)` }).from(bookings).where(eq(bookings.status, 'completed'))
      ]);
      
      const monthlyRevenue = await this.getMonthlyRevenue(currentYear, currentMonth);

      return {
        monthlyRecurringRevenue: monthlyRevenue,
        totalClients: Number(totalClients[0]?.count || 0),
        totalBookings: Number(totalBookings[0]?.count || 0),
        completionRate: totalBookings[0]?.count > 0 ? 
          (Number(completedBookings[0]?.count || 0) / Number(totalBookings[0]?.count)) * 100 : 0
      };
    }, {
      monthlyRecurringRevenue: 0,
      totalClients: 0,
      totalBookings: 0,
      completionRate: 0
    });
  }

  async getClientMetrics(): Promise<ClientMetrics> {
    return this.handleError(async () => {
      const allClients = await db.select().from(clients);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newClientsThisMonth = allClients.filter(client => 
        new Date(client.createdAt) >= thirtyDaysAgo
      );
      
      const clientsWithMultipleBookings = await db
        .select({ clientId: bookings.clientId, count: sql<number>`count(*)` })
        .from(bookings)
        .groupBy(bookings.clientId)
        .having(sql`count(*) > 1`);
      
      const currentRevenue = await this.getMonthlyRevenue(new Date().getFullYear(), new Date().getMonth() + 1);
      const avgLifetimeValue = allClients.length > 0 ? currentRevenue / allClients.length : 0;

      return {
        totalClients: allClients.length,
        newThisMonth: newClientsThisMonth.length,
        repeatClients: clientsWithMultipleBookings.length,
        avgLifetimeValue: Math.round(avgLifetimeValue)
      };
    }, {
      totalClients: 0,
      newThisMonth: 0,
      repeatClients: 0,
      avgLifetimeValue: 0
    });
  }

  async getProfile(): Promise<Profile | undefined> {
    return this.handleError(async () => {
      const profileList = await db.select().from(profiles).where(eq(profiles.isActive, true)).limit(1);
      return profileList[0];
    }, undefined);
  }

  async updateProfile(updateProfile: Partial<InsertProfile>): Promise<Profile> {
    const existingProfile = await this.getProfile();
    if (existingProfile) {
      const [profile] = await db.update(profiles)
        .set({ ...updateProfile, updatedAt: new Date() })
        .where(eq(profiles.id, existingProfile.id))
        .returning();
      return profile;
    } else {
      return this.createProfile(updateProfile as InsertProfile);
    }
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }
}

export const storage = new DatabaseStorage();
