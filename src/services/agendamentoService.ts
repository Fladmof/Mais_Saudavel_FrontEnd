import { get, post } from '../api/http';
import { endpoints } from '../api/endpoints';
import { Consulta } from '../api/types';

function slotsDisponiveis(medicoId: number | string, data: string) {
  return get<{ slots: string[] }>(endpoints.slotsDisponiveis(medicoId, data));
}
/** O utente agenda uma consulta num slot livre (data YYYY-MM-DD, hora HH:MM) */
function agendar(campos: { medico_id: number; data: string; hora: string; notas?: string }) {
  return post<{ consulta: Consulta }>(endpoints.agendar, campos);
}

export const agendamentoService = { slotsDisponiveis, agendar };
