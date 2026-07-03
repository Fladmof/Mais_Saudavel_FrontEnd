import { get, put } from '../api/http';
import { endpoints } from '../api/endpoints';
import { UtentePerfil } from '../api/types';

function fetchMeuPerfil() {
  return get<{ utente: UtentePerfil }>(endpoints.utenteMe);
}
function atualizarMeuPerfil(campos: Partial<UtentePerfil> & { nome?: string }) {
  return put<{ utente: UtentePerfil }>(endpoints.utenteMe, campos);
}
function listarUtentes() {
  return get<{ utentes: UtentePerfil[] }>(endpoints.utentes);
}
function pesquisarUtentes(nome: string) {
  return get<{ utentes: UtentePerfil[] }>(endpoints.utenteSearch(nome));
}
function obterUtente(id: number | string) {
  return get<{ utente: UtentePerfil }>(endpoints.utente(id));
}

export const utenteService = { fetchMeuPerfil, atualizarMeuPerfil, listarUtentes, pesquisarUtentes, obterUtente };
