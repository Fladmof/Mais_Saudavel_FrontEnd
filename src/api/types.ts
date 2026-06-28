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
