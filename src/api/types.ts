export type Role = 'utente' | 'medico' | 'admin' | 'user';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: Role;
  profile_picture?: string;
  /** perfis aninhados devolvidos por /auth/login e /auth/me */
  utente?: UtentePerfil | null;
  medico?: MedicoPerfil | null;
}

export interface AuthData {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface UtentePerfil {
  id: number;
  user_id: string;
  telefone: string;
  datanascimento: string;
  genero: string;
  bi: string;
  morada: string;
  gsanguineo: string;
  factorrh: string;
  peso: number;
  altura: number;
  alergia?: string | null;
  detalhes?: string | null;
  condespeciais?: string | null;
  contato_emergencia?: string | null;
  relacao?: string | null;
  telemergencia?: string | null;
  profissao?: string | null;
  user?: User;
}

export interface MedicoPerfil {
  id: number;
  user_id: string;
  hospital: string;
  especialidade: string;
  crm?: string | null;
  telefone?: string | null;
  bio?: string | null;
  categorias?: string[];
  avaliacao_media?: number;
  numero_avaliacoes?: number;
  user?: User;
}

export type EstadoConsulta = 'agendada' | 'em_curso' | 'concluida' | 'cancelada';

export interface Consulta {
  id: number;
  medico_id: number;
  utente_id: number;
  data_hora: string;
  estado: EstadoConsulta;
  room: string | null;
  video_url: string | null;
  notas: string | null;
  medico?: MedicoPerfil;
  utente?: UtentePerfil;
}

export interface Medicacao {
  id: number;
  utente_id: number;
  nome: string;
  dosagem?: string | null;
  frequencia?: string | null;
  horario?: string | null;
  notas?: string | null;
  ativo: boolean;
}

export type TipoRegisto = 'receita' | 'exame' | 'consulta';

export interface RegistoClinico {
  id: number;
  utente_id: number;
  tipo: TipoRegisto;
  titulo: string;
  descricao?: string | null;
  data?: string | null;
  foto_url?: string | null;
  medico_id?: number | null;
  validado_por_medico?: boolean;
}

// --- Agendamento ---

export interface HorarioDisponibilidade {
  id: number;
  medico_id: number;
  /** 0=domingo ... 6=sábado (convenção Date.getDay()) */
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  intervalo_minutos: number;
  ativo: boolean;
}

// --- Validação de conta ---

export type TipoDocumento = 'bi_frente' | 'bi_verso' | 'foto_pessoal';
export type EstadoDocumento = 'pendente' | 'aprovado' | 'rejeitado';

export interface Documento {
  id: number;
  user_id: string;
  tipo: TipoDocumento;
  ficheiro_url: string;
  estado: EstadoDocumento;
  motivo_rejeicao?: string | null;
}

// --- Alergias e condições ---

export type Severidade = 'leve' | 'moderada' | 'grave';

export interface Alergia {
  id: number;
  utente_id: number;
  nome: string;
  severidade: Severidade;
  notas?: string | null;
}

export interface CondicaoEspecial {
  id: number;
  utente_id: number;
  nome: string;
  notas?: string | null;
  ativa: boolean;
}

// --- Calorias ---

export type TipoRefeicao = 'pequeno_almoco' | 'almoco' | 'lanche' | 'jantar';

export interface RegistoCalorias {
  id: number;
  utente_id: number;
  foto_url?: string | null;
  alimentos: string[];
  calorias_total: number;
  tipo_refeicao: TipoRefeicao;
  origem: 'ia' | 'descricao' | 'manual';
  data_refeicao: string;
}

// --- Notificações ---

export interface Notificacao {
  id: number;
  user_id: string;
  type: string;
  title: string;
  message: string;
  related_id?: number | null;
  is_read: boolean;
  createdAt: string;
}
