# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Essential Commands:**
```bash
# Development server with hot reload
npm run dev

# Production build (Vite frontend + esbuild backend)
npm run build

# Start production server
npm start

# TypeScript type checking
npm run check

# Database schema push (apply changes)
npm run db:push
```

**Docker Commands:**
```bash
# Quick start production environment
./docker-scripts/start.sh

# Stop all Docker services
./docker-scripts/stop.sh

# View container logs
./docker-scripts/logs.sh app
./docker-scripts/logs.sh database

# Development with hot reload
docker-compose -f docker-compose.dev.yml up -d
```

## Architecture Overview

This is a **full-stack photography business management platform** built with:

**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + Radix UI/shadcn components
**Backend:** Express.js + TypeScript + PostgreSQL + Drizzle ORM
**Key Features:** AI booking assistant (OpenAI GPT-4), SMS integration (Twilio), client portal, admin dashboard

### Code Structure

```
client/                    # React frontend application
├── src/components/        # UI components organized by feature
│   ├── admin/            # Admin dashboard components
│   ├── client-portal/    # Client portal components
│   └── ui/               # Shared shadcn/ui components
├── src/pages/            # Application pages/routes
└── src/lib/              # API client and utilities

server/                   # Express backend
├── routes.ts             # API endpoint definitions
├── storage.ts            # Database operations layer
├── db.ts                 # Database connection setup
├── openai.ts             # AI integration services
└── twilio.ts             # SMS functionality

shared/
└── schema.ts             # Drizzle database schema (PostgreSQL)
```

### Database Architecture

**PostgreSQL with Drizzle ORM** - Key tables:
- `users` - Admin authentication
- `clients` - Customer CRM with lead scoring
- `services` - Photography packages
- `bookings` - Session scheduling
- `gallery_images` - Portfolio management
- `contact_messages` - Lead capture
- `ai_chats` - Booking assistant conversations
- `invoices` - Financial records

**Database Operations:**
- Schema changes: `npm run db:push`
- Migrations auto-generated in `/migrations/`
- Connection via `DATABASE_URL` environment variable

### Key Patterns

**Frontend:**
- Component composition with Radix UI primitives
- TanStack Query for server state management
- Wouter for client-side routing
- React Hook Form + Zod for form validation
- TypeScript throughout with shared schemas

**Backend:**
- Layered architecture: routes → storage → database
- Type-safe database operations with Drizzle
- Session-based authentication
- AI integration for business intelligence and booking assistance

### Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key

**Optional (for full functionality):**
- `OPENAI_API_KEY` - AI booking assistant and business intelligence
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` - SMS notifications

### Testing and Quality

- TypeScript checking: `npm run check`
- No specific test framework configured - check for existing tests before adding new ones
- Code follows shadcn/ui and Tailwind conventions

### Deployment

**Docker (Recommended):**
- Production: `./docker-scripts/start.sh`
- Includes PostgreSQL, Redis, and Nginx
- Uses multi-stage builds for optimization

**Platform Support:**
- Designed for Replit hosting
- Docker-compatible for any cloud platform
- Environment-based configuration