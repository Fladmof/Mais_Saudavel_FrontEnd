import { get, post, patch } from '../api/http';
import { endpoints } from '../api/endpoints';
import { Consulta, EstadoConsulta } from '../api/types';

function minhasConsultas(estado?: EstadoConsulta) {
  return get<{ consultas: Consulta[] }>(endpoints.consultasMinhas + (estado ? `?estado=${estado}` : ''));
}
function marcarConsulta(campos: { utente_id: number; data_hora: string; notas?: string }) {
  return post<{ consulta: Consulta }>(endpoints.consultas, campos);
}
function atualizarConsulta(id: number | string, campos: { estado?: EstadoConsulta; data_hora?: string; notas?: string }) {
  return patch<{ consulta: Consulta }>(endpoints.consulta(id), campos);
}
function obterConsulta(id: number | string) {
  return get<{ consulta: Consulta }>(endpoints.consulta(id));
}
function videoUrl(id: number | string) {
  return get<{ url: string; provider: string }>(endpoints.consultaVideo(id));
}

export const consultaService = { minhasConsultas, marcarConsulta, atualizarConsulta, obterConsulta, videoUrl };
