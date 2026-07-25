import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';
import { getToken } from '../api/tokenStore';
import { User, Role } from '../api/types';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

type RegisterPayload = { email: string; nome: string; password: string; [k: string]: any };

interface AuthContextValue {
  status: Status;
  user: User | null;
  signIn: (telefone: string, password: string) => Promise<{ ok: boolean; message: string }>;
  registerUtente: (payload: RegisterPayload) => Promise<{ ok: boolean; message: string }>;
  registerMedico: (payload: RegisterPayload) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<User | null>(null);

  const loadSession = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        setStatus('unauthenticated');
        return;
      }
      const r = await authService.fetchMe();
      if (r.ok && r.user) {
        setUser(r.user);
        setStatus('authenticated');
      } else {
        await authService.signOut();
        setStatus('unauthenticated');
      }
    } catch {
      await authService.signOut().catch(() => {});
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const signIn = useCallback(async (telefone: string, password: string) => {
    const r = await authService.signIn(telefone, password);
    if (r.ok && r.user) {
      setUser(r.user);
      setStatus('authenticated');
    }
    return { ok: r.ok, message: r.message };
  }, []);

  const doRegister = useCallback(async (payload: RegisterPayload, role: Role) => {
    const r = await authService.register({ ...payload, role });
    if (r.ok && r.user) {
      setUser(r.user);
      setStatus('authenticated');
    }
    return { ok: r.ok, message: r.message };
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const registerUtente = useCallback((p: RegisterPayload) => doRegister(p, 'utente'), [doRegister]);
  const registerMedico = useCallback((p: RegisterPayload) => doRegister(p, 'medico'), [doRegister]);

  const value = useMemo(
    () => ({ status, user, signIn, registerUtente, registerMedico, signOut }),
    [status, user, signIn, registerUtente, registerMedico, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth tem de ser usado dentro de <AuthProvider>');
  return ctx;
}
