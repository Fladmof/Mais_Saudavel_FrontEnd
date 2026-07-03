export type Role = 'utente' | 'medico' | 'admin' | 'user';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: Role;
  profile_picture?: string;
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
}
