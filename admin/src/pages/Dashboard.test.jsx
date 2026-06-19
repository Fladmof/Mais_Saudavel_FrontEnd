import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import apiClient from '../api/apiClient';
import Dashboard from './Dashboard';

vi.mock('../api/apiClient');

test('mostra contagens e atividade', async () => {
  apiClient.get = vi.fn((url) => {
    if (url.includes('stats')) return Promise.resolve({ data: { data: { pacientes: 5, medicos: 2 } } });
    return Promise.resolve({ data: { data: { eventos: [{ id: 1, action: 'ficha_access', target_name: 'Ana', createdAt: '2026-06-19T10:00:00Z' }] } } });
  });
  render(<Dashboard />);
  await waitFor(() => expect(screen.getByText('5')).toBeInTheDocument());
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText(/ficha_access/)).toBeInTheDocument();
});
