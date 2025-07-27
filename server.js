import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChatHandler } from './src/chatHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize chat handler
const chatHandler = new ChatHandler();

// In-memory session storage
const sessions = new Map();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'CADalytics Creator Factory',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Session management endpoints
app.post('/api/sessions', (req, res) => {
  try {
    const { uid } = req.body;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session = {
      id: sessionId,
      uid: uid || `user_${Date.now()}`,
      intent: null,
      selections: [],
      estimatedCost: 0,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    sessions.set(sessionId, session);
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

app.get('/api/sessions/:id', (req, res) => {
  try {
    const session = sessions.get(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await chatHandler.processMessage({
      message,
      sessionId: sessionId || 'default',
      userId: userId || 'anonymous'
    });

    // Update session if it exists
    if (sessionId && sessions.has(sessionId)) {
      const session = sessions.get(sessionId);
      session.messages.push({
        user: message,
        bot: result.message,
        timestamp: new Date().toISOString(),
        intent: result.intent
      });
      session.updatedAt = new Date().toISOString();
      sessions.set(sessionId, session);
    }

    res.json(result);
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Intent detection endpoint
app.post('/api/detect-intent', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = chatHandler.detectIntent(message);
    res.json(result);
  } catch (error) {
    console.error('Error detecting intent:', error);
    res.status(500).json({ error: 'Failed to detect intent' });
  }
});

// Cost calculation endpoint
app.post('/api/calculate-cost', (req, res) => {
  try {
    const { selections } = req.body;
    
    if (!selections) {
      return res.status(400).json({ error: 'Selections are required' });
    }

    const result = chatHandler.calculateCost(selections);
    res.json(result);
  } catch (error) {
    console.error('Error calculating cost:', error);
    res.status(500).json({ error: 'Failed to calculate cost' });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 CADalytics Creator Factory running on port ${port}`);
  console.log(`📡 Health check: http://localhost:${port}/api/health`);
  console.log(`💬 Chat API: http://localhost:${port}/api/chat`);
  console.log(`🎯 Web Interface: http://localhost:${port}`);
});

export default app;