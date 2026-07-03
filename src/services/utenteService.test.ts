jest.mock('../api/http', () => ({ get: jest.fn(), put: jest.fn(), post: jest.fn(), patch: jest.fn(), del: jest.fn() }));
import { get, put } from '../api/http';
import { utenteService } from './utenteService';

describe('utenteService', () => {
  it('fetchMeuPerfil chama GET /utente/me', async () => {
    (get as jest.Mock).mockResolvedValue({ ok: true, data: { utente: { id: 1 } }, message: '' });
    const r = await utenteService.fetchMeuPerfil();
    expect(get).toHaveBeenCalledWith('/utente/me');
    expect(r.ok).toBe(true);
  });

  it('atualizarMeuPerfil chama PUT /utente/me com os campos', async () => {
    (put as jest.Mock).mockResolvedValue({ ok: true, data: { utente: { id: 1 } }, message: '' });
    await utenteService.atualizarMeuPerfil({ alergia: 'Pólen' });
    expect(put).toHaveBeenCalledWith('/utente/me', { alergia: 'Pólen' });
  });

  it('pesquisarUtentes codifica o nome no URL', async () => {
    (get as jest.Mock).mockResolvedValue({ ok: true, data: { utentes: [] }, message: '' });
    await utenteService.pesquisarUtentes('José Á');
    expect(get).toHaveBeenCalledWith(`/utente/search/${encodeURIComponent('José Á')}`);
  });

  it('obterUtente usa o id no path', async () => {
    (get as jest.Mock).mockResolvedValue({ ok: true, data: { utente: { id: 7 } }, message: '' });
    await utenteService.obterUtente(7);
    expect(get).toHaveBeenCalledWith('/utente/7');
  });
});
