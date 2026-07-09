import { get, post, put, patch, del } from '../api/http';
import { endpoints } from '../api/endpoints';
import { MedicoPerfil, HorarioDisponibilidade } from '../api/types';

// O backend antigo devolve a lista de medicos no envelope {sucesso,dados}
// (o normalize da camada http ja o converte para {ok,data}).
function listarMedicos(especialidade?: string) {
  return get<MedicoPerfil[]>(endpoints.medicos + (especialidade ? `?especialidade=${encodeURIComponent(especialidade)}` : ''));
}
function listarEspecialidades() {
  return get<string[]>(endpoints.medicosEspecialidades);
}
function horariosDoMedico(medicoId: number | string) {
  return get<{ horarios: HorarioDisponibilidade[] }>(endpoints.medicoHorarios(medicoId));
}
/** Substitui a semana inteira de disponibilidade do médico autenticado */
function guardarSemana(horarios: Array<Pick<HorarioDisponibilidade, 'dia_semana' | 'hora_inicio' | 'hora_fim'> & { intervalo_minutos?: number; ativo?: boolean }>) {
  return put<{ horarios: HorarioDisponibilidade[] }>(endpoints.meusHorarios, { horarios });
}

export const medicoService = { listarMedicos, listarEspecialidades, horariosDoMedico, guardarSemana };
