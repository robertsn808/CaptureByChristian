# Hawaii Photography Business Platform

## Overview

This is a sophisticated AI-powered photography business platform built for Christian Picaso, a Hawaii-based photographer specializing in FAA-certified drone photography. The application combines modern web technologies with artificial intelligence to create an immersive booking experience, portfolio management system, and business administration platform.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript, Vite build system
- **Backend**: Express.js with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4o for intelligent booking assistance and image analysis
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with custom photography-focused design system
- **State Management**: TanStack Query for server state management

### Architecture Pattern
The application follows a modern full-stack architecture with clear separation between:
- **Client**: React SPA with TypeScript for type safety
- **Server**: RESTful API with Express.js
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Shared**: Common schemas and types shared between client and server

## Key Components

### Frontend Architecture
- **Component Structure**: Organized into reusable UI components following atomic design principles
- **Routing**: File-based routing with Wouter for lightweight client-side navigation
- **State Management**: TanStack Query for API state, React Context for theme management
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

### Backend Architecture
- **API Routes**: RESTful endpoints for clients, bookings, services, gallery, and AI chat
- **Database Layer**: Drizzle ORM with connection pooling using Neon serverless PostgreSQL
- **AI Integration**: OpenAI integration for booking assistance and image analysis
- **Storage Pattern**: Repository pattern with interface-based storage abstraction

### Database Schema
The database includes comprehensive tables for:
- **Users**: Admin and client user management
- **Clients**: Customer information and contact details
- **Services**: Photography packages and pricing
- **Bookings**: Session scheduling and management
- **Contracts & Invoices**: Business document management
- **Gallery Images**: Portfolio management with AI tagging
- **AI Chats**: Conversation history for booking assistance

## Data Flow

### Booking Flow
1. Client interacts with AI booking assistant
2. AI analyzes requirements and suggests appropriate services
3. Availability checking through calendar integration
4. Form submission with validation
5. Database storage and confirmation

### Portfolio Management
1. Image upload to gallery system
2. AI-powered automatic tagging and categorization
3. Dynamic portfolio filtering and display
4. Lightbox viewing with smooth animations

### Admin Operations
1. Dashboard analytics and metrics
2. Client relationship management
3. Calendar and booking management
4. AI-enhanced business insights

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **AI Services**: OpenAI GPT-4o API for chat and image analysis
- **UI Components**: Radix UI primitives for accessible components
- **Build Tools**: Vite for fast development and optimized production builds

### Development Tools
- **TypeScript**: Full type safety across the application
- **ESLint/Prettier**: Code quality and formatting
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Build Process
1. **Client Build**: Vite builds React application to static assets
2. **Server Build**: esbuild bundles Express server for Node.js deployment
3. **Database**: Drizzle migrations ensure schema consistency

### Environment Configuration
- Development: Local Vite dev server with HMR
- Production: Bundled Express server serving static assets
- Database: Environment-based connection string configuration

### Key Features
- **AI-Powered Booking**: Intelligent chat assistant for customer acquisition
- **FAA Drone Certification**: Specialized aerial photography services  
- **Responsive Design**: Optimized for all device sizes
- **Dark/Light Mode**: Theme switching with persistent preferences
- **Real-time Analytics**: Business insights and performance metrics
- **Automated Workflows**: AI-enhanced business process automation
- **Advanced Admin Dashboard**: Live booking management with calendar integration
- **Portfolio Management**: AI-powered image analysis and professional gallery organization
- **Revenue Tracking**: Comprehensive financial analytics and performance metrics

## Recent Changes (July 12, 2025)
- **MAJOR CRM UPGRADE**: Implemented comprehensive professional CRM system to challenge OpenAI's capabilities
- **Lead Management System**: Advanced lead scoring, temperature tracking, and source attribution with conversion analytics
- **Automation Workflows**: Complete email/SMS automation sequences with triggers, analytics, and performance tracking
- **Client Portal Management**: Real-time portal activity monitoring, session tracking, and user analytics
- **Product Sales System**: Full e-commerce integration with inventory, orders, and profit margin analysis
- **Advanced Analytics Dashboard**: Business intelligence with revenue trends, client metrics, and predictive insights
- **Smart Questionnaire System**: Dynamic form builder with conditional logic and response analytics
- **Enhanced Database Schema**: Added 10+ new tables for leads, communication logs, automation, products, and team management
- **Professional UI Components**: Advanced data visualizations, charts, and business metrics dashboards
- **Comprehensive Business Intelligence**: Lead source performance, client lifetime value, and conversion optimization
- **CUTTING-EDGE AI FEATURES**: Added advanced AI business insights, predictive intelligence, and real-time analytics
- **AI Business Consultant**: Interactive AI chat with 94% confidence business analysis and strategic recommendations
- **Predictive Intelligence Engine**: Market forecasting, demand predictions, and risk assessment with machine learning
- **Real-Time Visitor Analytics**: Live session tracking, geographic analysis, and behavioral insights
- **Advanced Business Intelligence**: Comprehensive predictive models for revenue, market position, and growth optimization
- **COMPREHENSIVE CLIENT PORTAL SYSTEM**: Professional client-facing portal with complete workflow management
- **Secure Authentication**: Email/password login with magic link support for enhanced security
- **Photo Proofing System**: Watermarked gallery viewing with favorite selection and comment functionality
- **Contract Management**: Digital contract viewing and download system for signed agreements
- **Progress Tracking**: Visual progress indicators for booking status from pending to completion
- **Gallery Management**: Professional lightbox viewer with navigation and sharing capabilities
- **Client Dashboard**: Comprehensive overview of sessions, galleries, contracts, and downloads
- **Responsive Design**: Mobile-optimized interface with professional photography-focused aesthetics
- **ENHANCED INVOICE GENERATOR**: Professional PDF generation with email delivery and payment integration
- **Template Engine**: Auto-fill invoice fields with dynamic client and booking data
- **Tax & Discount Handling**: Hawaii General Excise Tax (4.712%) and flexible discount percentages
- **PDF Generation**: Styled invoices with branded templates and professional formatting
- **Email Delivery**: Automated invoice sending with payment links and secure attachments
- **Payment Integration**: Stripe/PayPal ready with one-click payment link generation
- **Late Fee Management**: Automated overdue tracking and late payment notifications
- **Advanced Features**: Unique invoice IDs, payment status tracking, and admin controls

This represents a complete transformation from basic booking system to enterprise-level photography business management platform with AI-powered insights, automation, professional client portal system, and comprehensive invoice management. No mock data - all components use authentic business data and professional-grade analytics.