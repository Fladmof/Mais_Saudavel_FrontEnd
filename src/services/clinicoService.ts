import { get, post, put, del } from '../api/http';
import { endpoints } from '../api/endpoints';
import { Medicacao, RegistoClinico, TipoRegisto } from '../api/types';

function listarMedicacoes(utenteId: number | string) {
  return get<{ medicacoes: Medicacao[] }>(endpoints.medicacoes(utenteId));
}
function criarMedicacao(utenteId: number | string, campos: Partial<Medicacao> & { nome: string }) {
  return post<{ medicacao: Medicacao }>(endpoints.medicacoes(utenteId), campos);
}
function atualizarMedicacao(id: number | string, campos: Partial<Medicacao>) {
  return put<{ medicacao: Medicacao }>(endpoints.medicacao(id), campos);
}
function apagarMedicacao(id: number | string) {
  return del(endpoints.medicacao(id));
}
function listarRegistos(utenteId: number | string, tipo?: TipoRegisto) {
  return get<{ registos: RegistoClinico[] }>(endpoints.registos(utenteId) + (tipo ? `?tipo=${tipo}` : ''));
}
function criarRegisto(
  utenteId: number | string,
  campos: { tipo: TipoRegisto; titulo: string; descricao?: string; data?: string }
) {
  return post<{ registo: RegistoClinico }>(endpoints.registos(utenteId), campos);
}
function apagarRegisto(id: number | string) {
  return del(endpoints.registo(id));
}

export const clinicoService = {
  listarMedicacoes,
  criarMedicacao,
  atualizarMedicacao,
  apagarMedicacao,
  listarRegistos,
  criarRegisto,
  apagarRegisto,
};
