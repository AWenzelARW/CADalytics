# CADalytics Creator Factory - AI-Powered Civil 3D Tool Generator

## Overview

CADalytics Creator Factory is a full-stack web application that provides an AI-powered chatbot interface for generating Civil 3D tools and configurations. The application features intelligent intent detection, real-time cost calculation, and specialized creators for different types of Civil 3D assets including LISP routines, drawing templates, corridor subassemblies, and custom solutions.

## Recent Changes (January 2025)

### Template System Restoration - January 27, 2025
- **Fixed JavaScript errors**: Resolved undefined 'templates' variable causing template page crashes
- **Restored 8 AIA-compliant templates**: Minimal, Master, Site Plan, Existing Conditions, Proposed Surface, Drainage, Utilities, Plot Sheet
- **Enhanced layer selection**: All layers now start selected by default with easy unselection workflow
- **Added collision detection**: Template editor properly manages z-index and prevents overlap with cost estimator
- **Interactive customization**: Click-to-customize cards with comprehensive layer and style selection
- **Professional features**: Complete CAD styles, real AIA National CAD Standard layer naming, and proper pricing structure ($2 per layer)

### CAD Styles System Implementation - January 27, 2025
- **Fixed CAD styles functionality**: Resolved function reference errors and template opening issues
- **Implemented checkbox interface**: CAD styles now work exactly like layer selection with toggle checkboxes
- **Context-aware UI**: "Add Custom Layer" section properly hidden when on Styles tab
- **Comprehensive style categories**: Text, Dimension, Surface, Multileader, Plot, and Linetype styles for all templates
- **Professional standards**: Includes Standard, Annotative, Arial, Simplex fonts with proper sizing and decimal precision
- **Template-specific styles**: Each template type gets appropriate CAD styles (drainage gets hydraulic styles, utilities get pressure/voltage styles, etc.)

### Build System Fix - January 27, 2025
- **Fixed Docker build failures**: Resolved Vite build errors that prevented deployment
- **Created custom build script**: `build.js` handles the hybrid architecture correctly
- **Updated deployment process**: Works with Railway, Render, Heroku and manual deployment
- **Simplified build output**: Clean dist/ directory with server bundle and static files
- **Production-ready**: All build issues resolved for successful deployment

## User Preferences

Preferred communication style: Simple, everyday language.
Template interaction preference: All layers AND styles should start selected by default, users prefer to unselect what they don't need rather than manually select everything.
UI preference: Clean, professional interface with proper collision detection to prevent overlapping windows.
Styles interface requirement: CAD styles must work exactly like layers with identical checkbox interface and visual consistency.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Client-side routing with conditional rendering based on application state
- **State Management**: React hooks with custom session management
- **UI Framework**: Radix UI components with Tailwind CSS styling
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui component library

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints for session management and health checks
- **Session Storage**: In-memory storage with Map-based implementation (scalable to database)
- **Middleware**: CORS, compression, and security headers via Helmet

### Data Storage Solutions
- **Development**: In-memory storage using JavaScript Map
- **Production Ready**: Drizzle ORM configured for PostgreSQL with Neon Database
- **Schema**: Sessions table with user identification, intent tracking, selections, and cost estimation
- **Migration**: Drizzle Kit for database schema management

## Key Components

### AI Intent Detection System
- **Keyword-based Classification**: Analyzes user messages to determine intent (LISP, template, subassembly, custom)
- **Confidence Scoring**: Provides confidence levels for intent matches
- **Contextual Responses**: Generates appropriate suggestions and next steps based on detected intent

### Session Management
- **Anonymous Authentication**: Firebase anonymous authentication for user identification
- **Session Persistence**: Maintains user state across browser sessions
- **Real-time Updates**: Tracks selections, intent changes, and cost calculations

### Creator Modules
- **LISP Creator**: Tool for selecting and configuring automation routines with specialized AutoLISP functions
- **Template Creator**: Comprehensive interface for building AIA-compliant drawing templates with full layer customization, CAD styles, and professional standards
- **Subassembly Selector**: Catalog of pre-built corridor components including curbs, sidewalks, barriers, and specialized elements
- **Custom Request Handler**: Form-based interface for specialized requirements and bespoke solutions

### Cost Calculation Engine
- **Real-time Pricing**: Dynamic cost calculation based on selections with immediate updates
- **Tiered Pricing Model**: Base template pricing plus $2 per layer for granular control
- **Budget Optimization**: Intelligent recommendations for cost-effective solutions
- **Floating Cost Estimator**: Draggable interface with collision detection and proper z-index management

## Data Flow

1. **User Interaction**: User sends message through chat interface
2. **Intent Detection**: AI analyzes message and determines user intent
3. **Session Update**: Intent and selections are stored in session
4. **Cost Calculation**: Pricing engine calculates estimated costs
5. **Response Generation**: System provides contextual responses and suggestions
6. **Creator Routing**: User can be routed to specialized creator interfaces
7. **Selection Tracking**: All user choices are persisted in session storage

## External Dependencies

### Core Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Authentication**: Firebase for user management
- **Database**: Neon Database (PostgreSQL) with Drizzle ORM

### AI Integration
- **Google Genkit**: AI framework for intelligent responses and intent detection
- **Firebase Genkit**: Integration layer for Firebase services
- **Google AI**: Generative AI capabilities for enhanced responses

### Development Tools
- **Build System**: Vite with ESBuild for fast development and production builds
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESLint and Prettier for code standards
- **Development**: Hot module replacement and error overlay

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: Local PostgreSQL or Neon Database connection
- **Environment Variables**: Local .env file for configuration

### Production Deployment
- **Platform**: Optimized for Railway deployment with minimal configuration
- **Build Process**: Vite builds client, ESBuild bundles server
- **Static Assets**: Client built to dist/public directory
- **Server**: Express server serves both API and static files
- **Database**: PostgreSQL via Neon Database with connection pooling

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Firebase**: Configuration via environment variables for authentication
- **Port**: Configurable via PORT environment variable (defaults to 3000)
- **Node Environment**: Production/development mode switching

### Scalability Considerations
- **Session Storage**: Currently in-memory, easily upgradeable to database persistence
- **Database**: Drizzle ORM ready for PostgreSQL scaling
- **API**: RESTful design supports horizontal scaling
- **Static Assets**: Separated from API for CDN deployment if needed