import { post, get, patch } from '../api/http';
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

// Pede um codigo de recuperacao. Em dev (sem SMTP) o backend devolve devCode.
async function forgotPassword(email: string): Promise<{ ok: boolean; message: string; devCode?: string }> {
  const res = await post<{ emailSent: boolean; devCode?: string }>(endpoints.forgotPassword, { email });
  return { ok: res.ok, message: res.message, devCode: res.data?.devCode };
}

async function resetPassword(email: string, code: string, password: string): Promise<{ ok: boolean; message: string }> {
  const res = await post<Record<string, never>>(endpoints.resetPassword, { email, code, password });
  return { ok: res.ok, message: res.message };
}

// Eliminacao parcial: os dados clinicos ficam preservados mas o login e desativado.
async function partialDelete(password: string): Promise<{ ok: boolean; message: string }> {
  const res = await patch(endpoints.accountPartialDelete, { password });
  if (res.ok) await clearToken();
  return { ok: res.ok, message: res.message };
}

export const authService = { signIn, register, fetchMe, signOut, forgotPassword, resetPassword, partialDelete };
