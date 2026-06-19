// Mais_Saudavel_FrontEnd/admin/src/pages/Login.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

const loginMock = vi.fn();
vi.mock('../auth/AuthContext', () => ({ useAuth: () => ({ login: loginMock }) }));

import Login from './Login';

test('mostra erro quando o login falha', async () => {
  loginMock.mockRejectedValueOnce(new Error('Apenas administradores podem aceder a este painel.'));
  render(<MemoryRouter><Login /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.c' } });
  fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'x' } });
  fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
  await waitFor(() => expect(screen.getByText(/Apenas administradores/i)).toBeInTheDocument());
});
