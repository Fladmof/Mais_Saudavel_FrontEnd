// Mais_Saudavel_FrontEnd/admin/src/auth/AuthContext.test.jsx
import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import apiClient from '../api/apiClient';
import { AuthProvider, useAuth } from './AuthContext';

vi.mock('../api/apiClient');

beforeEach(() => localStorage.clear());

function Probe() {
  const { user, login } = useAuth();
  return (
    <div>
      <span>role:{user?.role || 'none'}</span>
      <button onClick={() => login('a@b.c', 'x')}>entrar</button>
    </div>
  );
}

test('login com role admin define o utilizador', async () => {
  apiClient.post = vi.fn().mockResolvedValue({ data: { data: { token: 't', user: { role: 'admin', nome: 'Adm' } } } });
  render(<AuthProvider><Probe /></AuthProvider>);
  await act(async () => { screen.getByText('entrar').click(); });
  expect(screen.getByText('role:admin')).toBeInTheDocument();
  expect(localStorage.getItem('admin_token')).toBe('t');
  expect(JSON.parse(localStorage.getItem('admin_user')).role).toBe('admin');
});

test('login rejeita role nao-admin', async () => {
  apiClient.post = vi.fn().mockResolvedValue({ data: { data: { token: 't', user: { role: 'utente' } } } });
  let erro = null;
  function Probe2() {
    const { login } = useAuth();
    return <button onClick={async () => { try { await login('a','b'); } catch (e) { erro = e; } }}>go</button>;
  }
  render(<AuthProvider><Probe2 /></AuthProvider>);
  await act(async () => { screen.getByText('go').click(); });
  expect(erro).toBeTruthy();
  expect(localStorage.getItem('admin_token')).toBeNull();
  expect(erro.code).toBe('NOT_ADMIN');
});
