jest.mock('../api/http');
jest.mock('../api/tokenStore');

import * as http from '../api/http';
import * as store from '../api/tokenStore';
import { authService } from './authService';

const mockedPost = http.post as jest.Mock;
const mockedGet = http.get as jest.Mock;
const mockedSetToken = store.setToken as jest.Mock;

beforeEach(() => jest.clearAllMocks());

test('signIn ok guarda token e devolve user', async () => {
  const user = { id: '1', nome: 'Ana', email: 'a@a.com', role: 'utente' };
  mockedPost.mockResolvedValue({ ok: true, data: { token: 'tok', user }, message: 'Login bem sucedido' });
  const r = await authService.signIn('a@a.com', 'secret');
  expect(http.post).toHaveBeenCalledWith('/auth/login', { email: 'a@a.com', password: 'secret' });
  expect(store.setToken).toHaveBeenCalledWith('tok');
  expect(r).toEqual({ ok: true, user, message: 'Login bem sucedido' });
});

test('signIn falhado não guarda token', async () => {
  mockedPost.mockResolvedValue({ ok: false, data: null, message: 'Email ou senha inválidos' });
  const r = await authService.signIn('a@a.com', 'x');
  expect(mockedSetToken).not.toHaveBeenCalled();
  expect(r.ok).toBe(false);
  expect(r.user).toBeNull();
});

test('register envia role e guarda token', async () => {
  const user = { id: '2', nome: 'Zé', email: 'z@z.com', role: 'medico' };
  mockedPost.mockResolvedValue({ ok: true, data: { token: 'tok2', user }, message: 'Registro bem sucedido' });
  const r = await authService.register({ email: 'z@z.com', nome: 'Zé', password: 'secret', role: 'medico' });
  expect(http.post).toHaveBeenCalledWith('/auth/register', { email: 'z@z.com', nome: 'Zé', password: 'secret', role: 'medico' });
  expect(store.setToken).toHaveBeenCalledWith('tok2');
  expect(r.user).toEqual(user);
});

test('fetchMe devolve user de data.user', async () => {
  const user = { id: '1', nome: 'Ana', email: 'a@a.com', role: 'utente' };
  mockedGet.mockResolvedValue({ ok: true, data: { user }, message: '' });
  const r = await authService.fetchMe();
  expect(http.get).toHaveBeenCalledWith('/auth/me');
  expect(r.user).toEqual(user);
});
