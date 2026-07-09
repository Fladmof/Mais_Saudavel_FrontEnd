import { get, post, put, del } from '../api/http';
import { endpoints } from '../api/endpoints';
import { Medicacao, RegistoClinico, TipoRegisto, Alergia, CondicaoEspecial, Severidade } from '../api/types';

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

/** Cria um registo (receita/exame) com foto anexada (uri do expo-image-picker) */
function criarRegistoComFoto(
  utenteId: number | string,
  campos: { tipo: TipoRegisto; titulo: string; descricao?: string; data?: string },
  fotoUri: string
) {
  const form = new FormData();
  form.append('tipo', campos.tipo);
  form.append('titulo', campos.titulo);
  if (campos.descricao) form.append('descricao', campos.descricao);
  if (campos.data) form.append('data', campos.data);
  form.append('foto', { uri: fotoUri, name: `registo-${Date.now()}.jpg`, type: 'image/jpeg' } as any);
  return post<{ registo: RegistoClinico }>(endpoints.registos(utenteId), form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// --- Alergias e condicoes especiais ---

function listarAlergias(utenteId: number | string) {
  return get<{ alergias: Alergia[] }>(endpoints.alergias(utenteId));
}
function criarAlergia(utenteId: number | string, campos: { nome: string; severidade?: Severidade; notas?: string }) {
  return post<{ alergia: Alergia }>(endpoints.alergias(utenteId), campos);
}
function apagarAlergia(id: number | string) {
  return del(endpoints.alergia(id));
}
function listarCondicoes(utenteId: number | string) {
  return get<{ condicoes: CondicaoEspecial[] }>(endpoints.condicoes(utenteId));
}
function criarCondicao(utenteId: number | string, campos: { nome: string; notas?: string }) {
  return post<{ condicao: CondicaoEspecial }>(endpoints.condicoes(utenteId), campos);
}
function apagarCondicao(id: number | string) {
  return del(endpoints.condicao(id));
}

export const clinicoService = {
  listarMedicacoes,
  criarMedicacao,
  atualizarMedicacao,
  apagarMedicacao,
  listarRegistos,
  criarRegisto,
  criarRegistoComFoto,
  apagarRegisto,
  listarAlergias,
  criarAlergia,
  apagarAlergia,
  listarCondicoes,
  criarCondicao,
  apagarCondicao,
};
