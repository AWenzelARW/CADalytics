#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting CADalytics Creator Factory build process...');

try {
  // Step 1: Build the server
  console.log('Building server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', 
    { stdio: 'inherit' });

  // Step 2: Ensure dist/public directory exists and copy static files
  console.log('Setting up public directory...');
  
  const publicDir = 'dist/public';
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Copy existing static files if they exist
  if (fs.existsSync('dist/public/index.html')) {
    console.log('Static HTML file already exists in dist/public');
  } else {
    console.log('Creating minimal index.html for production...');
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CADalytics Creator Factory</title>
    <meta name="description" content="AI-powered Civil 3D tool generator">
</head>
<body>
    <div id="app">
        <h1>CADalytics Creator Factory</h1>
        <p>Loading application...</p>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);
  }

  // Step 3: Create a package.json for production
  const prodPackageJson = {
    "name": "cadalytics-creator-factory",
    "version": "1.0.0",
    "type": "module",
    "main": "index.js",
    "scripts": {
      "start": "node index.js"
    },
    "dependencies": {
      "express": "^4.21.2",
      "cors": "^2.8.5"
    }
  };

  fs.writeFileSync(path.join('dist', 'package.json'), JSON.stringify(prodPackageJson, null, 2));

  console.log('✅ Build completed successfully!');
  console.log('📁 Built files are in the dist/ directory');
  console.log('🚀 Run "cd dist && npm install && npm start" to start the production server');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}