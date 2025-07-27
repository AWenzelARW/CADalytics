#!/bin/bash

# CADalytics Creator Factory Deployment Script
# This script deploys the application for iframe embedding

echo "🚀 Deploying CADalytics Creator Factory..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set production environment
export NODE_ENV=production

# Start the server
echo "🌐 Starting server..."
echo "Application will be available at: http://localhost:3000"
echo "Ready for iframe embedding with CORS support"

npm start