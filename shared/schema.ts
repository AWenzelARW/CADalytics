import { z } from 'zod';
import { pgTable, text, timestamp, integer, boolean, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Session table schema
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  uid: text('uid').notNull(),
  intent: text('intent'), // 'lisp', 'template', 'subassembly', 'custom', or null
  selections: text('selections').array().default([]), // Array of selected items
  estimatedCost: integer('estimated_cost').default(0), // Cost in cents
  messages: text('messages').array().default([]), // Chat message history
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Zod schemas
export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateSessionSchema = insertSessionSchema.partial();

// Types
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type UpdateSession = z.infer<typeof updateSessionSchema>;

// Message schema for chat
export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.enum(['user', 'assistant']),
  timestamp: z.string(),
  suggestions: z.array(z.string()).optional(),
});

export type Message = z.infer<typeof messageSchema>;

// Intent types
export const intentSchema = z.enum(['lisp', 'template', 'subassembly', 'custom']);
export type Intent = z.infer<typeof intentSchema>;