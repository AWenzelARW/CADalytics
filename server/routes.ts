import { Router } from 'express';
import { z } from 'zod';
import { IStorage } from './storage.js';
import { insertSessionSchema, updateSessionSchema, messageSchema } from '../shared/schema.js';

export function createRoutes(storage: IStorage) {
  const router = Router();

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy',
      service: 'CADalytics Creator Factory',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // Create session
  router.post('/sessions', async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      console.error('Error creating session:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid session data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create session' });
    }
  });

  // Get session
  router.get('/sessions/:id', async (req, res) => {
    try {
      const session = await storage.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json(session);
    } catch (error) {
      console.error('Error getting session:', error);
      res.status(500).json({ error: 'Failed to get session' });
    }
  });

  // Update session
  router.patch('/sessions/:id', async (req, res) => {
    try {
      const updates = updateSessionSchema.parse(req.body);
      const session = await storage.updateSession(req.params.id, updates);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      res.json(session);
    } catch (error) {
      console.error('Error updating session:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid update data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to update session' });
    }
  });

  // Chat endpoint
  router.post('/chat', async (req, res) => {
    try {
      const { message, sessionId, userId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Simple intent detection based on keywords
      const intentKeywords = {
        lisp: ['lisp', 'routine', 'automation', 'script', 'automate', 'batch', 'macro'],
        template: ['template', 'style', 'layer', 'drawing', 'standard', 'format', 'layout'],
        subassembly: ['subassembly', 'corridor', 'curb', 'road', 'pavement', 'assembly', 'cross-section'],
        custom: ['custom', 'special', 'consultation', 'unique', 'specific', 'tailored']
      };

      let detectedIntent = null;
      const lowerMessage = message.toLowerCase();
      
      for (const [intent, keywords] of Object.entries(intentKeywords)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
          detectedIntent = intent;
          break;
        }
      }

      // Generate response based on intent
      let response = "I understand you're looking for help with Civil 3D tools. ";
      let suggestions = [];

      switch (detectedIntent) {
        case 'lisp':
          response += "I can help you create LISP routines for automation. What specific tasks would you like to automate?";
          suggestions = ["Line automation", "Block insertion", "Text formatting", "Layer management"];
          break;
        case 'template':
          response += "I can help you create drawing templates with standardized styles and layers. What type of project is this for?";
          suggestions = ["Site plan template", "Roadway template", "Utility template", "Survey template"];
          break;
        case 'subassembly':
          response += "I can help you find corridor subassemblies for your project. What type of roadway are you designing?";
          suggestions = ["Urban street", "Highway", "Rural road", "Intersection"];
          break;
        case 'custom':
          response += "I can help you with custom solutions. Let me know more details about your specific requirements.";
          suggestions = ["Schedule consultation", "Custom automation", "Training materials", "Technical support"];
          break;
        default:
          response += "How can I assist you today? I can help with LISP routines, drawing templates, corridor subassemblies, or custom solutions.";
          suggestions = ["LISP automation", "Drawing templates", "Corridor design", "Custom solutions"];
      }

      // Update session if provided
      if (sessionId) {
        const session = await storage.getSession(sessionId);
        if (session) {
          await storage.updateSession(sessionId, {
            intent: detectedIntent,
            messages: [...(session.messages || []), message]
          });
        }
      }

      res.json({
        message: response,
        intent: detectedIntent,
        suggestions,
        confidence: detectedIntent ? 0.8 : 0.3
      });

    } catch (error) {
      console.error('Error processing chat:', error);
      res.status(500).json({ error: 'Failed to process message' });
    }
  });

  return router;
}