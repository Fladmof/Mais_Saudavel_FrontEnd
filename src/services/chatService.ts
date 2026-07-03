import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../api/resolveBaseUrl';
import { getToken } from '../api/tokenStore';

// Cliente do chat Socket.io do backend (mensagensController):
// eventos user:join, message:send, message:received, messages:history, message:system.

export type ChatMessage = {
  id: string;
  userId: string | null;
  username: string;
  text: string;
  type: 'user' | 'system';
  timestamp: string;
};

export function mapHistoryRow(row: any): ChatMessage {
  return {
    id: String(row.id),
    userId: row.senderId ?? null,
    username: row.senderName ?? '',
    text: row.content ?? '',
    type: row.messageType === 'user' ? 'user' : 'system',
    timestamp: row.createdAt ?? '',
  };
}

export function mapIncoming(payload: any): ChatMessage {
  return {
    id: String(payload.id),
    userId: payload.userId ?? null,
    username: payload.username ?? '',
    text: payload.text ?? '',
    type: payload.type === 'user' ? 'user' : 'system',
    timestamp: payload.timestamp ?? '',
  };
}

export async function connectChat(): Promise<Socket> {
  const token = await getToken();
  return io(BASE_URL, { transports: ['websocket'], auth: { token } });
}

export function joinRoom(socket: Socket, username: string, room: string): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    socket.emit('user:join', { username, room }, (resp: any) => {
      resolve(resp?.error ? { ok: false, error: resp.error } : { ok: true });
    });
  });
}

export function sendMessage(socket: Socket, text: string, room: string): Promise<{ ok: boolean; error?: string }> {
  return new Promise((resolve) => {
    socket.emit('message:send', { text, room }, (resp: any) => {
      resolve(resp?.error ? { ok: false, error: resp.error } : { ok: true });
    });
  });
}
