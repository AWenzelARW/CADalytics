import { Session, InsertSession, UpdateSession } from '../shared/schema.js';

export interface IStorage {
  // Session operations
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | null>;
  updateSession(id: string, updates: UpdateSession): Promise<Session | null>;
  deleteSession(id: string): Promise<boolean>;
  listSessions(uid?: string): Promise<Session[]>;
}

// In-memory storage implementation
export class MemoryStorage implements IStorage {
  private sessions = new Map<string, Session>();

  async createSession(sessionData: InsertSession): Promise<Session> {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const session: Session = {
      id,
      uid: sessionData.uid,
      intent: sessionData.intent ?? null,
      selections: sessionData.selections ?? [],
      estimatedCost: sessionData.estimatedCost ?? 0,
      messages: sessionData.messages ?? [],
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
    
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: string): Promise<Session | null> {
    return this.sessions.get(id) || null;
  }

  async updateSession(id: string, updates: UpdateSession): Promise<Session | null> {
    const session = this.sessions.get(id);
    if (!session) return null;

    const updatedSession: Session = {
      ...session,
      ...updates,
      updatedAt: new Date(),
    };

    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteSession(id: string): Promise<boolean> {
    return this.sessions.delete(id);
  }

  async listSessions(uid?: string): Promise<Session[]> {
    const allSessions = Array.from(this.sessions.values());
    
    if (uid) {
      return allSessions.filter(session => session.uid === uid);
    }
    
    return allSessions;
  }
}