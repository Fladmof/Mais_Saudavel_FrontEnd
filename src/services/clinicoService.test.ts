jest.mock('../api/http', () => ({ get: jest.fn(), put: jest.fn(), post: jest.fn(), patch: jest.fn(), del: jest.fn() }));
import { get, post, put, del } from '../api/http';
import { clinicoService } from './clinicoService';

describe('clinicoService', () => {
  it('listarMedicacoes usa o path do utente', async () => {
    (get as jest.Mock).mockResolvedValue({ ok: true, data: { medicacoes: [] }, message: '' });
    await clinicoService.listarMedicacoes(1);
    expect(get).toHaveBeenCalledWith('/utentes/1/medicacoes');
  });

  it('criarMedicacao faz POST com o payload', async () => {
    (post as jest.Mock).mockResolvedValue({ ok: true, data: { medicacao: { id: 5 } }, message: '' });
    await clinicoService.criarMedicacao(1, { nome: 'Paracetamol', dosagem: '500mg' });
    expect(post).toHaveBeenCalledWith('/utentes/1/medicacoes', { nome: 'Paracetamol', dosagem: '500mg' });
  });

  it('atualizarMedicacao faz PUT /medicacoes/:id', async () => {
    (put as jest.Mock).mockResolvedValue({ ok: true, data: { medicacao: { id: 5 } }, message: '' });
    await clinicoService.atualizarMedicacao(5, { ativo: false });
    expect(put).toHaveBeenCalledWith('/medicacoes/5', { ativo: false });
  });

  it('apagarMedicacao faz DELETE', async () => {
    (del as jest.Mock).mockResolvedValue({ ok: true, data: null, message: '' });
    await clinicoService.apagarMedicacao(5);
    expect(del).toHaveBeenCalledWith('/medicacoes/5');
  });

  it('listarRegistos com filtro de tipo', async () => {
    (get as jest.Mock).mockResolvedValue({ ok: true, data: { registos: [] }, message: '' });
    await clinicoService.listarRegistos(1, 'receita');
    expect(get).toHaveBeenCalledWith('/utentes/1/registos?tipo=receita');
  });

  it('criarRegisto e apagarRegisto usam os paths certos', async () => {
    (post as jest.Mock).mockResolvedValue({ ok: true, data: { registo: { id: 7 } }, message: '' });
    (del as jest.Mock).mockResolvedValue({ ok: true, data: null, message: '' });
    await clinicoService.criarRegisto(1, { tipo: 'exame', titulo: 'Raio-X' });
    expect(post).toHaveBeenCalledWith('/utentes/1/registos', { tipo: 'exame', titulo: 'Raio-X' });
    await clinicoService.apagarRegisto(7);
    expect(del).toHaveBeenCalledWith('/registos/7');
  });
});
