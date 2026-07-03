jest.mock('./client', () => ({ client: { post: jest.fn(), get: jest.fn(), put: jest.fn(), patch: jest.fn(), delete: jest.fn() } }));
import { client } from './client';
import { get, put, patch, del } from './http';

describe('http helpers', () => {
  it('put normaliza envelope success', async () => {
    (client.put as jest.Mock).mockResolvedValue({ data: { success: true, data: { x: 1 }, message: 'ok' } });
    const r = await put('/p', { a: 1 });
    expect(r.ok).toBe(true);
    expect(r.data).toEqual({ x: 1 });
  });

  it('erro sem resposta marca network=true', async () => {
    (client.get as jest.Mock).mockRejectedValue(new Error('Network Error'));
    const r = await get('/x');
    expect(r.ok).toBe(false);
    expect(r.network).toBe(true);
  });

  it('erro com resposta do servidor nao marca network', async () => {
    (client.patch as jest.Mock).mockRejectedValue({ response: { data: { success: false, message: 'nope' } } });
    const r = await patch('/x', {});
    expect(r.ok).toBe(false);
    expect(r.network).toBeUndefined();
    expect(r.message).toBe('nope');
  });

  it('del devolve normalizado', async () => {
    (client.delete as jest.Mock).mockResolvedValue({ data: { success: true, data: null, message: 'apagado' } });
    const r = await del('/x/1');
    expect(r.ok).toBe(true);
  });
});
