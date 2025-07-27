# CADalytics Creator Factory - Production

Production-ready AI chatbot for Civil 3D tool generation, optimized for Railway deployment.

## Features

- **AI Intent Detection** - Smart routing for LISP, Template, Subassembly, and Custom requests
- **Real-time Cost Calculator** - Dynamic pricing with live updates
- **Interactive Chat Interface** - Professional UI with creator selection cards
- **Session Management** - In-memory storage with upgrade path to database
- **Production Security** - Helmet security headers and CORS protection

## Quick Deployment

### Railway (Recommended)
```bash
# Deploy directly to Railway
npm start
```

### Local Development
```bash
npm install
npm run dev
```

## API Endpoints

- `GET /api/health` - Service health check
- `POST /api/chat` - Main chat processing
- `POST /api/sessions` - Session management
- `POST /api/detect-intent` - Intent detection
- `POST /api/calculate-cost` - Cost calculations

## Architecture

```
production/
├── server.js           # Express server with security
├── src/chatHandler.js  # Core AI logic
├── public/index.html   # Full-featured chat interface
├── package.json        # Minimal dependencies
└── README.md          # This file
```

## Dependencies

- **express** - Web server framework
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **compression** - Response compression

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode

## Features

### Chat Interface
- Professional header with online status
- Welcome message with creator selection cards
- Real-time messaging with suggestions
- Mobile-responsive design

### Cost Estimator
- Live calculation updates
- Pricing breakdown by category
- Session tracking with counters
- Professional pricing guide

### Intent Detection
- Keyword-based classification
- LISP routine detection
- Template creation routing
- Subassembly selection
- Custom solution handling

### Session Management
- Unique session IDs
- Message history tracking
- Intent and selection persistence
- Real-time updates

## Pricing Structure

- LISP Routines: $5 each
- Template Base: $30 + $10 per style + $5 per layer
- Subassemblies: $20 each
- Custom Package: $100 base

## Production Ready

- Security headers with Helmet
- CORS configuration
- Response compression
- Error handling and logging
- Health check endpoint
- Static file serving

Your CADalytics Creator Factory is ready for production deployment!