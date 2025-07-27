# CADalytics Creator Factory - Deployment Guide

## Quick Start

1. **Download and Extract**
   ```bash
   tar -xzf cadalytics-creator-factory.tar.gz
   cd cadalytics-creator-factory
   ```

2. **Deploy**
   ```bash
   ./deploy.sh
   ```

## Manual Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Application**
   ```bash
   npm start
   ```

## Iframe Embedding

The application is fully optimized for iframe embedding:

```html
<iframe 
  src="http://your-server:3000" 
  width="100%" 
  height="800px"
  frameborder="0"
  allow="fullscreen"
  style="border: none; border-radius: 8px;">
</iframe>
```

## Features Included

✅ **Professional UI**: Glassmorphism design with dark/light themes
✅ **Draggable Cost Estimator**: Real-time pricing with smooth animations  
✅ **Enhanced Graphics**: Professional icons with gradient effects
✅ **CORS Enabled**: Ready for cross-origin iframe embedding
✅ **Security Headers**: Proper iframe compatibility
✅ **Session Management**: In-memory storage (database-ready)
✅ **Responsive Design**: Works on all devices

## Technical Specifications

- **Frontend**: Pure HTML/CSS/JavaScript (no build process required)
- **Backend**: Express.js with CORS and iframe support
- **Port**: 3000 (configurable via PORT environment variable)
- **Memory**: ~50MB RAM usage
- **Storage**: In-memory sessions (easily upgradeable to database)

## Production Deployment

For production environments:

1. Set environment variables:
   ```bash
   export NODE_ENV=production
   export PORT=80
   ```

2. Use process manager:
   ```bash
   pm2 start server.js --name cadalytics
   ```

3. Configure reverse proxy (Nginx):
   ```nginx
   location / {
       proxy_pass http://localhost:3000;
       proxy_set_header X-frame-Options "ALLOWALL";
   }
   ```

## Iframe Compatibility Features

- ✅ CORS headers properly configured
- ✅ X-Frame-Options set to ALLOWALL  
- ✅ Content Security Policy allows all frame ancestors
- ✅ Session storage works in iframe context
- ✅ No external dependencies that block iframe loading
- ✅ Professional animations work within iframe constraints

The application is ready for immediate deployment and iframe embedding!