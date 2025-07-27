// server/index.ts
import express from "express";
import cors from "cors";

// server/storage.ts
var MemoryStorage = class {
  sessions = /* @__PURE__ */ new Map();
  async createSession(sessionData) {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const session = {
      id,
      uid: sessionData.uid,
      intent: sessionData.intent ?? null,
      selections: sessionData.selections ?? [],
      estimatedCost: sessionData.estimatedCost ?? 0,
      messages: sessionData.messages ?? [],
      createdAt: new Date(now),
      updatedAt: new Date(now)
    };
    this.sessions.set(id, session);
    return session;
  }
  async getSession(id) {
    return this.sessions.get(id) || null;
  }
  async updateSession(id, updates) {
    const session = this.sessions.get(id);
    if (!session) return null;
    const updatedSession = {
      ...session,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }
  async deleteSession(id) {
    return this.sessions.delete(id);
  }
  async listSessions(uid) {
    const allSessions = Array.from(this.sessions.values());
    if (uid) {
      return allSessions.filter((session) => session.uid === uid);
    }
    return allSessions;
  }
};

// server/routes.ts
import { Router } from "express";
import { z as z2 } from "zod";

// shared/schema.ts
import { z } from "zod";
import { pgTable, text, timestamp, integer, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  uid: text("uid").notNull(),
  intent: text("intent"),
  // 'lisp', 'template', 'subassembly', 'custom', or null
  selections: text("selections").array().default([]),
  // Array of selected items
  estimatedCost: integer("estimated_cost").default(0),
  // Cost in cents
  messages: text("messages").array().default([]),
  // Chat message history
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var updateSessionSchema = insertSessionSchema.partial();
var messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.enum(["user", "assistant"]),
  timestamp: z.string(),
  suggestions: z.array(z.string()).optional()
});
var intentSchema = z.enum(["lisp", "template", "subassembly", "custom"]);

// server/routes.ts
function createRoutes(storage2) {
  const router = Router();
  router.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      service: "CADalytics Creator Factory",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "1.0.0"
    });
  });
  router.post("/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage2.createSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid session data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create session" });
    }
  });
  router.get("/sessions/:id", async (req, res) => {
    try {
      const session = await storage2.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error getting session:", error);
      res.status(500).json({ error: "Failed to get session" });
    }
  });
  router.patch("/sessions/:id", async (req, res) => {
    try {
      const updates = updateSessionSchema.parse(req.body);
      const session = await storage2.updateSession(req.params.id, updates);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error updating session:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid update data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update session" });
    }
  });
  router.post("/chat", async (req, res) => {
    try {
      const { message, sessionId, userId } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      const intentKeywords = {
        lisp: ["lisp", "routine", "automation", "script", "automate", "batch", "macro"],
        template: ["template", "style", "layer", "drawing", "standard", "format", "layout"],
        subassembly: ["subassembly", "corridor", "curb", "road", "pavement", "assembly", "cross-section"],
        custom: ["custom", "special", "consultation", "unique", "specific", "tailored"]
      };
      let detectedIntent = null;
      const lowerMessage = message.toLowerCase();
      for (const [intent, keywords] of Object.entries(intentKeywords)) {
        if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
          detectedIntent = intent;
          break;
        }
      }
      let response = "I understand you're looking for help with Civil 3D tools. ";
      let suggestions = [];
      switch (detectedIntent) {
        case "lisp":
          response += "I can help you create LISP routines for automation. What specific tasks would you like to automate?";
          suggestions = ["Line automation", "Block insertion", "Text formatting", "Layer management"];
          break;
        case "template":
          response += "I can help you create drawing templates with standardized styles and layers. What type of project is this for?";
          suggestions = ["Site plan template", "Roadway template", "Utility template", "Survey template"];
          break;
        case "subassembly":
          response += "I can help you find corridor subassemblies for your project. What type of roadway are you designing?";
          suggestions = ["Urban street", "Highway", "Rural road", "Intersection"];
          break;
        case "custom":
          response += "I can help you with custom solutions. Let me know more details about your specific requirements.";
          suggestions = ["Schedule consultation", "Custom automation", "Training materials", "Technical support"];
          break;
        default:
          response += "How can I assist you today? I can help with LISP routines, drawing templates, corridor subassemblies, or custom solutions.";
          suggestions = ["LISP automation", "Drawing templates", "Corridor design", "Custom solutions"];
      }
      if (sessionId) {
        const session = await storage2.getSession(sessionId);
        if (session) {
          await storage2.updateSession(sessionId, {
            intent: detectedIntent,
            messages: [...session.messages || [], message]
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
      console.error("Error processing chat:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });
  return router;
}

// server/index.ts
var app = express();
var port = Number(process.env.PORT) || 5e3;
var storage = new MemoryStorage();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static("dist/public"));
app.use("/api", createRoutes(storage));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "dist/public" });
});
app.listen(port, "0.0.0.0", () => {
  console.log(`\u{1F680} Server running on http://0.0.0.0:${port}`);
  console.log(`\u{1F4F1} Frontend available at http://0.0.0.0:${port}`);
  console.log(`\u{1F50C} API available at http://0.0.0.0:${port}/api`);
});
