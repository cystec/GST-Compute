# GST Calculator Web Application

## Overview

This is a full-stack web application built as a GST (Goods and Services Tax) calculator. The application follows a modern React-based frontend with an Express.js backend architecture, designed for calculating GST amounts both inclusive and exclusive of tax rates. The calculator supports both standard and custom GST rates, and provides Indian tax system compliance with IGST vs CGST/SGST breakdown calculations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation (via @hookform/resolvers)

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for RESTful API server
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based sessions with connect-pg-simple
- **Development**: tsx for TypeScript execution in development

### Build System
- **Frontend**: Vite with React plugin and custom aliases
- **Backend**: esbuild for production bundling
- **Development**: Concurrent development server with Vite middleware integration
- **TypeScript**: Shared configuration across client, server, and shared modules

## Key Components

### Frontend Components
- **UI Library**: Complete Shadcn/ui component set including forms, dialogs, navigation, and data display components
- **Main Application**: Enhanced GST Calculator with:
  - Dual input modes (inclusive/exclusive tax calculation)
  - Custom GST rate input functionality
  - Indian tax system compliance (IGST vs CGST/SGST selection)
  - Automatic tax breakdown for CGST/SGST (50/50 split)
  - Standard GST rates (0.25%, 3%, 5%, 12%, 18%, 28%)
- **Router**: Simple wouter-based routing with 404 handling
- **Query Client**: Configured TanStack Query client with custom fetch utilities

### Backend Components
- **Express Server**: Main application server with middleware for JSON parsing, CORS, and logging
- **Route Registration**: Modular route system with API prefix structure
- **Storage Interface**: Abstracted storage layer with in-memory implementation (ready for database integration)
- **Error Handling**: Centralized error handling middleware

### Shared Components
- **Database Schema**: Drizzle schema definitions with Zod validation
- **Type Definitions**: Shared TypeScript types between frontend and backend

## Data Flow

### Current Implementation
1. **Frontend**: React components render GST calculator interface
2. **State Management**: Local component state for calculator logic
3. **API Ready**: TanStack Query configured for server communication
4. **Backend**: Express server with route stubs ready for implementation
5. **Storage**: In-memory storage interface ready for database integration

### Database Integration (Configured but not Active)
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Migrations**: Migration system configured in `./migrations` directory
- **Schema**: User authentication schema defined with username/password fields
- **Connection**: Neon Database connection string configuration

## External Dependencies

### Frontend Dependencies
- **UI Framework**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulations
- **Carousel**: Embla Carousel for image/content sliders

### Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **Validation**: Zod for runtime type validation
- **Sessions**: connect-pg-simple for PostgreSQL session storage

### Development Dependencies
- **Runtime**: tsx for TypeScript execution
- **Bundling**: esbuild for production builds
- **Development**: Vite with React plugin and error overlay
- **Replit Integration**: Cartographer plugin for Replit environment

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` starts development server with hot reload
- **Port Configuration**: Automatic port detection with Vite dev server
- **File Watching**: TypeScript compilation and React hot reload
- **Error Handling**: Runtime error overlay in development

### Production Build
- **Frontend Build**: `npm run build` creates optimized static assets
- **Backend Build**: esbuild bundles server code for Node.js execution
- **Output Directory**: `dist/` contains both client assets and server bundle
- **Static Serving**: Express configured to serve built frontend assets

### Database Operations
- **Migration Command**: `npm run db:push` applies schema changes
- **Environment**: DATABASE_URL environment variable required
- **Schema Location**: `./shared/schema.ts` contains table definitions
- **Migration Output**: `./migrations` directory stores migration files

### Replit Integration
- **Banner**: Development banner for Replit environment detection
- **Cartographer**: Code intelligence plugin for Replit IDE
- **Runtime Error Modal**: Enhanced error reporting in development

The application is structured as a monorepo with clear separation between client, server, and shared code, making it easy to scale and maintain. The GST calculator functionality is currently implemented on the frontend with a backend API structure ready for extension with user authentication, data persistence, and additional business logic.