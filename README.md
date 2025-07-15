# CapturedCCollective Media Platform

A sophisticated AI-powered media business management platform built for professional media teams specializing in cinematic, high-impact content creation and FAA-certified drone photography. This application combines modern web technologies with artificial intelligence to create an immersive booking experience, portfolio management system, and comprehensive business administration platform.

## 🌺 Features

### Client-Facing Features
- **Professional Portfolio Gallery** - Curated showcase of photography work with AI-powered image analysis
- **Lead Capture System** - Gated portfolio access that converts visitors into qualified leads
- **AI Booking Assistant** - Intelligent chat system for service inquiries and booking requests
- **Service Showcase** - Detailed photography packages with pricing and descriptions
- **Contact System** - Professional contact forms with automated lead management

### Business Management
- **Admin Dashboard** - Comprehensive business analytics and performance metrics
- **Client Relationship Management** - Complete client profiles with interaction history
- **Booking Management** - Calendar integration with booking status tracking
- **Service Management** - CRUD operations for photography services and packages
- **Invoice Generator** - Professional PDF invoices with Hawaii GET tax integration
- **Contract Management** - Digital contract creation and management
- **Gallery Management** - Upload, organize, and feature portfolio images
- **Lead Management** - Qualified lead tracking with scoring and temperature assessment

### Advanced Features
- **AI Business Intelligence** - Data-driven insights and performance analytics
- **Revenue Tracking** - Comprehensive financial reporting and forecasting
- **Client Portal** - Secure client access for gallery viewing and communication
- **SMS Integration** - Automated notifications via Twilio
- **Real-time Analytics** - Live business performance monitoring

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive design
- **Radix UI** with shadcn/ui components for accessibility
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Wouter** for lightweight client-side routing

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Neon serverless hosting
- **Drizzle ORM** for type-safe database operations
- **OpenAI GPT-4o** for AI features and business intelligence

### Infrastructure
- **Replit** for development and hosting
- **Connection pooling** with Neon PostgreSQL
- **Environment-based configuration**
- **Session-based authentication**

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- OpenAI API key (optional, for AI features)
- Twilio credentials (optional, for SMS)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hawaii-photography-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   OPENAI_API_KEY=your_openai_api_key (optional)
   TWILIO_ACCOUNT_SID=your_twilio_sid (optional)
   TWILIO_AUTH_TOKEN=your_twilio_token (optional)
   TWILIO_PHONE_NUMBER=your_twilio_phone (optional)
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
hawaii-photography-platform/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utility functions
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database operations
│   ├── db.ts              # Database connection
│   └── openai.ts          # AI integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
├── migrations/            # Database migration files
└── package.json          # Dependencies and scripts
```

## 🎯 Key Workflows

### Lead Generation Flow
1. Visitor views homepage featuring curated portfolio images
2. Click "View Portfolio" triggers lead capture form
3. Visitor provides name and email for portfolio access
4. Session-based access grants immediate portfolio viewing
5. Lead automatically appears in admin dashboard for follow-up

### Booking Process
1. Client interacts with AI booking assistant
2. AI analyzes requirements and suggests appropriate services
3. Calendar availability checking and date selection
4. Form submission with client details and preferences
5. Booking confirmation and admin notification

### Business Management
1. Admin dashboard provides real-time business metrics
2. Lead management with scoring and temperature tracking
3. Client relationship management with interaction history
4. Service management with pricing and package updates
5. Invoice generation with professional PDF output

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Database operations
npm run db:push        # Push schema changes
npm run db:studio      # Open Drizzle Studio

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🗄 Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - Admin user accounts
- **clients** - Customer information and contact details
- **services** - Photography packages and pricing
- **bookings** - Session scheduling and management
- **contracts** - Business document management
- **invoices** - Financial records and billing
- **gallery_images** - Portfolio management with AI tagging
- **contact_messages** - Lead capture and communication
- **ai_chats** - Conversation history for booking assistance
- **client_portal_sessions** - Secure client access tracking

## 🤖 AI Features

### Business Intelligence
- Real-time performance analytics using actual business data
- Predictive revenue forecasting based on booking patterns
- Client behavior analysis and insights
- Automated business recommendations

### Booking Assistant
- Natural language processing for client inquiries
- Intelligent service recommendations
- Availability checking and scheduling assistance
- Automated follow-up suggestions

### Image Analysis
- Automatic tagging and categorization of portfolio images
- Quality assessment and composition analysis
- Featured image recommendations for homepage display

## 🔒 Security Features

- Session-based authentication for client portal access
- SQL injection prevention with parameterized queries
- Input validation with Zod schemas
- IP address and user agent tracking for security monitoring
- Environment variable protection for sensitive data

## 📊 Analytics & Reporting

### Business Metrics
- Revenue tracking with monthly/yearly comparisons
- Booking conversion rates and pipeline analysis
- Client acquisition costs and lifetime value
- Service performance and popularity metrics

### Lead Analytics
- Lead source attribution and conversion tracking
- Lead scoring based on engagement and demographics
- Temperature tracking (hot, warm, cold leads)
- Portfolio access analytics and conversion rates

## 🌐 Deployment

The application is designed for Replit deployment with:

- Automatic environment variable management
- PostgreSQL database provisioning
- SSL certificate handling
- Custom domain support
- Automated health checks

## 📝 License

This project is proprietary software for Christian Falonzo photography business.

## 🤝 Support

For technical support or feature requests, please contact the development team.

---

**Built with ❤️ for professional photographers in Hawaii**