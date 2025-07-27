const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for iframe embedding
app.use(cors({
    origin: '*',
    credentials: true
}));

// Set headers to allow iframe embedding
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('Content-Security-Policy', "frame-ancestors *;");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes for session management
app.use(express.json());

// In-memory session storage
const sessions = new Map();

// Session management endpoints
app.post('/api/session', (req, res) => {
    const sessionId = Date.now().toString();
    sessions.set(sessionId, {
        id: sessionId,
        intent: null,
        selections: [],
        totalCost: 0,
        createdAt: new Date()
    });
    res.json({ sessionId });
});

app.get('/api/session/:id', (req, res) => {
    const session = sessions.get(req.params.id);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
});

app.put('/api/session/:id', (req, res) => {
    const session = sessions.get(req.params.id);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    Object.assign(session, req.body);
    sessions.set(req.params.id, session);
    res.json(session);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Fallback route - serve index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CADalytics Creator Factory running on http://0.0.0.0:${PORT}`);
    console.log(`📱 Ready for iframe embedding`);
});