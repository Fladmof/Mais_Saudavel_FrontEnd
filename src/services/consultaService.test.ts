jest.mock('../api/http', () => ({ get: jest.fn(), post: jest.fn(), patch: jest.fn(), put: jest.fn(), del: jest.fn() }));
import { get, post, patch } from '../api/http';
import { consultaService } from './consultaService';

describe('consultaService', () => {
  it('minhasConsultas sem filtro', async () => {
    (get as jest.Mock).mockResolvedValue({ ok: true, data: { consultas: [] }, message: '' });
    await consultaService.minhasConsultas();
    expect(get).toHaveBeenCalledWith('/consultas/minhas');
  });

  it('minhasConsultas com estado', async () => {
    (get as jest.Mock).mockResolvedValue({ ok: true, data: { consultas: [] }, message: '' });
    await consultaService.minhasConsultas('agendada');
    expect(get).toHaveBeenCalledWith('/consultas/minhas?estado=agendada');
  });

  it('marcarConsulta faz POST /consultas', async () => {
    (post as jest.Mock).mockResolvedValue({ ok: true, data: { consulta: { id: 1 } }, message: '' });
    await consultaService.marcarConsulta({ utente_id: 2, data_hora: '2026-07-10T10:00:00.000Z' });
    expect(post).toHaveBeenCalledWith('/consultas', { utente_id: 2, data_hora: '2026-07-10T10:00:00.000Z' });
  });

  it('atualizarConsulta faz PATCH', async () => {
    (patch as jest.Mock).mockResolvedValue({ ok: true, data: { consulta: { id: 1 } }, message: '' });
    await consultaService.atualizarConsulta(1, { estado: 'em_curso' });
    expect(patch).toHaveBeenCalledWith('/consultas/1', { estado: 'em_curso' });
  });

  it('videoUrl e obterConsulta usam os paths certos', async () => {
    (get as jest.Mock).mockResolvedValue({ ok: true, data: { url: 'x', provider: 'jitsi' }, message: '' });
    await consultaService.videoUrl(3);
    expect(get).toHaveBeenCalledWith('/consultas/3/video');
    await consultaService.obterConsulta(3);
    expect(get).toHaveBeenCalledWith('/consultas/3');
  });
});
