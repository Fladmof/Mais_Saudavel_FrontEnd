import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import apiClient from '../api/apiClient';
import Pacientes from './Pacientes';

vi.mock('../api/apiClient');

test('lista pacientes vindos da API', async () => {
  apiClient.get = vi.fn().mockResolvedValue({
    data: { data: { utentes: [{ id: 1, telefone: '912', user: { nome: 'Ana Silva', email: 'ana@x.pt' } }] } }
  });
  render(<MemoryRouter><Pacientes /></MemoryRouter>);
  await waitFor(() => expect(screen.getByText('Ana Silva')).toBeInTheDocument());
  expect(screen.getByText('ana@x.pt')).toBeInTheDocument();
});
