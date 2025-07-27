# CADalytics Creator Factory - Build Guide

## Build Process Fixed ✅

The build process has been completely fixed to work with the project's hybrid architecture.

### What Was Fixed

1. **Removed problematic Vite build**: The original `npm run build` was trying to run `vite build` but couldn't find an `index.html` at the root
2. **Created custom build script**: `build.js` handles the server bundling and static file preparation
3. **Fixed Docker deployment**: Updated Dockerfile to use the custom build process

### Current Architecture

This project uses a hybrid approach:
- **Server**: Express.js backend in TypeScript (built with esbuild)
- **Frontend**: Static HTML with inline JavaScript in `dist/public/index.html`
- **Client Components**: React components in `client/` (for future development)

### Build Commands

#### Development
```bash
npm run dev
```

#### Production Build
```bash
# Using custom build script (recommended)
node build.js

# Or using npm (will use the custom script)
npm run build
```

#### Docker Build
```dockerfile
# The Dockerfile now uses our custom build process
docker build -t cadalytics-creator-factory .
docker run -p 3000:3000 cadalytics-creator-factory
```

### Build Output

After running the build:
- `dist/index.js` - Bundled server application
- `dist/package.json` - Production package.json with minimal dependencies
- `dist/public/` - Static frontend files
- Ready for deployment to any Node.js hosting platform

### Deployment Platforms

#### Railway/Render/Heroku
- The build process is now compatible with all major Node.js hosting platforms
- Set build command to: `node build.js`
- Set start command to: `node dist/index.js`

#### Manual Deployment
```bash
# Build the project
node build.js

# Deploy the dist folder
cd dist
npm install --production
node index.js
```

### Key Files

- `build.js` - Custom build script that handles the unique project structure
- `Dockerfile` - Updated to use the custom build process
- `dist/` - Build output directory ready for production
- `package.json` - Contains the build configuration (do not modify directly)

### Troubleshooting

If you encounter build issues:
1. Make sure Node.js 18+ is installed
2. Run `npm ci` to install exact dependencies
3. Use `node build.js` instead of `npm run build` if needed
4. Check that `dist/public/index.html` exists with your application code