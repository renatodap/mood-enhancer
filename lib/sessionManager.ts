import { Session, Message, FeelingType } from '@/types';

// In-memory session storage (resets on server restart/page refresh)
const sessions = new Map<string, Session>();

export function createSession(userName: string, feeling: FeelingType): Session {
  const sessionId = generateSessionId();
  const session: Session = {
    id: sessionId,
    userName,
    feeling,
    messages: [],
    startTime: new Date(),
  };
  sessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId: string): Session | undefined {
  return sessions.get(sessionId);
}

export function addMessage(sessionId: string, message: Message): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.messages.push(message);
  }
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}