import { get, patch, post } from '../api/http';
import { endpoints } from '../api/endpoints';
import { Notificacao } from '../api/types';

function listar() {
  return get<{ notificacoes: Notificacao[]; naoLidas: number }>(endpoints.notificacoes);
}
function contagem() {
  return get<{ naoLidas: number }>(endpoints.notificacoesContagem);
}
function marcarLida(id: number | string) {
  return patch<{ notificacao: Notificacao }>(endpoints.notificacaoLida(id));
}
function marcarTodasLidas() {
  return patch(endpoints.notificacoesLidas);
}
/** Médico envia lembrete ao utente de uma consulta */
function notificarConsulta(consultaId: number | string, mensagem?: string) {
  return post(endpoints.consultaNotificar(consultaId), mensagem ? { mensagem } : {});
}

export const notificacaoService = { listar, contagem, marcarLida, marcarTodasLidas, notificarConsulta };
