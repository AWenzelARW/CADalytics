import express from 'express';
import cors from 'cors';
import { MemoryStorage } from './storage.js';
import { createRoutes } from './routes.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

// Initialize storage
const storage = new MemoryStorage();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('dist/public'));

// Routes
app.use('/api', createRoutes(storage));

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist/public' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
  console.log(`📱 Frontend available at http://0.0.0.0:${port}`);
  console.log(`🔌 API available at http://0.0.0.0:${port}/api`);
});