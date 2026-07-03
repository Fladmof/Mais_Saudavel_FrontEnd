import { mapHistoryRow, mapIncoming, joinRoom, sendMessage } from './chatService';

describe('chatService', () => {
  it('mapHistoryRow converte row do modelo Message', () => {
    const m = mapHistoryRow({
      id: 'm1',
      content: 'ola',
      senderId: 'u1',
      senderName: 'Ana',
      messageType: 'user',
      createdAt: '2026-07-03T10:00:00Z',
    });
    expect(m).toEqual({ id: 'm1', userId: 'u1', username: 'Ana', text: 'ola', type: 'user', timestamp: '2026-07-03T10:00:00Z' });
  });

  it('mapIncoming converte payload de message:received e system', () => {
    const m = mapIncoming({ id: 'x', userId: 'u2', username: 'Rui', text: 'oi', type: 'user', timestamp: 't', room: 'r' });
    expect(m.type).toBe('user');
    const s = mapIncoming({ id: 'sys_1', text: 'Ana entrou no chat', type: 'system', timestamp: 't', room: 'r' });
    expect(s.type).toBe('system');
    expect(s.username).toBe('');
  });

  it('joinRoom resolve ok com callback de sucesso', async () => {
    const fake = { emit: (_e: string, _d: any, cb: (r: any) => void) => cb({ success: true }) } as any;
    await expect(joinRoom(fake, 'Ana', 'sala')).resolves.toEqual({ ok: true });
  });

  it('sendMessage resolve erro do servidor', async () => {
    const fake = { emit: (_e: string, _d: any, cb: (r: any) => void) => cb({ error: 'Usuário banido' }) } as any;
    await expect(sendMessage(fake, 'oi', 'sala')).resolves.toEqual({ ok: false, error: 'Usuário banido' });
  });
});
