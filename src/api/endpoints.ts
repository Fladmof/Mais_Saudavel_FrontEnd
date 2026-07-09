export const endpoints = {
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  utenteMe: '/utente/me',
  utentes: '/utente',
  utenteSearch: (nome: string) => `/utente/search/${encodeURIComponent(nome)}`,
  utente: (id: number | string) => `/utente/${id}`,
  consultas: '/consultas',
  consultasMinhas: '/consultas/minhas',
  consulta: (id: number | string) => `/consultas/${id}`,
  consultaVideo: (id: number | string) => `/consultas/${id}/video`,
  medicacoes: (utenteId: number | string) => `/utentes/${utenteId}/medicacoes`,
  medicacao: (id: number | string) => `/medicacoes/${id}`,
  registos: (utenteId: number | string) => `/utentes/${utenteId}/registos`,
  registo: (id: number | string) => `/registos/${id}`,
  chatHistory: (room: string) => `/mensagens/history/${encodeURIComponent(room)}`,
  // Agendamento pelo utente
  medicos: '/medicos',
  medicosEspecialidades: '/medicos/especialidades',
  medicoHorarios: (medicoId: number | string) => `/medicos/${medicoId}/horarios`,
  meusHorarios: '/medicos/me/horarios',
  slotsDisponiveis: (medicoId: number | string, data: string) =>
    `/consultas/slots-disponiveis?medico_id=${medicoId}&data=${data}`,
  agendar: '/consultas/agendar',
  consultaNotificar: (id: number | string) => `/consultas/${id}/notificar`,
  // Validacao de conta por documentos
  documentosUpload: '/documentos/upload',
  documentosStatus: '/documentos/status',
  // Alergias e condicoes especiais
  alergias: (utenteId: number | string) => `/utentes/${utenteId}/alergias`,
  alergia: (id: number | string) => `/alergias/${id}`,
  condicoes: (utenteId: number | string) => `/utentes/${utenteId}/condicoes`,
  condicao: (id: number | string) => `/condicoes/${id}`,
  // Calorias
  calorias: '/calorias',
  caloriasHistorico: (periodo: string) => `/calorias/historico?periodo=${periodo}`,
  caloriaRegisto: (id: number | string) => `/calorias/${id}`,
  // Notificacoes
  notificacoes: '/notificacoes',
  notificacoesContagem: '/notificacoes/contagem',
  notificacaoLida: (id: number | string) => `/notificacoes/${id}/lida`,
  notificacoesLidas: '/notificacoes/lidas',
  // Conta
  accountPartialDelete: '/auth/account/partial-delete',
} as const;
