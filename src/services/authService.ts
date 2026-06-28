import { post, get } from '../api/http';
import { endpoints } from '../api/endpoints';
import { setToken, clearToken } from '../api/tokenStore';
import { AuthData, User, Role } from '../api/types';

type AuthResult = { ok: boolean; user: User | null; message: string };

async function signIn(email: string, password: string): Promise<AuthResult> {
  const res = await post<AuthData>(endpoints.login, { email, password });
  if (res.ok && res.data?.token) {
    await setToken(res.data.token);
    return { ok: true, user: res.data.user, message: res.message };
  }
  return { ok: false, user: null, message: res.message };
}

async function register(payload: { email: string; nome: string; password: string; role: Role; [k: string]: any }): Promise<AuthResult> {
  const res = await post<AuthData>(endpoints.register, payload);
  if (res.ok && res.data?.token) {
    await setToken(res.data.token);
    return { ok: true, user: res.data.user, message: res.message };
  }
  return { ok: false, user: null, message: res.message };
}

async function fetchMe(): Promise<AuthResult> {
  const res = await get<{ user: User }>(endpoints.me);
  if (res.ok && res.data?.user) return { ok: true, user: res.data.user, message: res.message };
  return { ok: false, user: null, message: res.message };
}

async function signOut(): Promise<void> {
  await clearToken();
}

export const authService = { signIn, register, fetchMe, signOut };
