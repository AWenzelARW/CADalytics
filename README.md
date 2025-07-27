# CADalytics Creator Factory - Railway Deployment

## Quick Deploy to Railway

1. **Upload this tarball to Railway**
2. **Set build command**: `node build.js`
3. **Set start command**: `node dist/index.js`
4. **Deploy**

## Files Included

- `server/` - Express.js backend source code
- `shared/` - Shared TypeScript schemas
- `dist/` - Pre-built static files and production assets
- `package.json` - Dependencies and scripts
- `build.js` - Custom build script
- `Dockerfile` - Container configuration

## Environment Variables

Set these in Railway dashboard if needed:
- `PORT` - Railway will set this automatically
- `NODE_ENV=production`
- `DATABASE_URL` - If using PostgreSQL

## Build Process

The custom `build.js` script:
1. Bundles the TypeScript server with esbuild
2. Prepares static files in dist/public
3. Creates production package.json
4. Ready for Railway deployment

Railway will automatically:
- Run `node build.js` during build
- Start with `node dist/index.js`
- Set PORT environment variable
- Handle SSL/TLS certificates