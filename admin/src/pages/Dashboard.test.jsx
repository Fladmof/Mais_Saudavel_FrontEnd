import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthProvider } from '../auth/AuthContext';
import apiClient from '../api/apiClient';
import Dashboard from './Dashboard';

vi.mock('../api/apiClient');

test('mostra as contagens reais nos cartões', async () => {
  apiClient.get = vi.fn(() =>
    Promise.resolve({ data: { data: { utilizadores: 100, pacientes: 5, medicos: 2, consultas: 50 } } })
  );
  render(<AuthProvider><Dashboard /></AuthProvider>);
  await waitFor(() => expect(screen.getByText('100')).toBeInTheDocument());
  expect(screen.getByText('50')).toBeInTheDocument();
  expect(screen.getByText('Utilizadores Totais')).toBeInTheDocument();
  expect(screen.getByText('Consultas realizadas')).toBeInTheDocument();
});
