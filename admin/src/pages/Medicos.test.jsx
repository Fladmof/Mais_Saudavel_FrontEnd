// Mais_Saudavel_FrontEnd/admin/src/pages/Medicos.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import apiClient from '../api/apiClient';
import Medicos from './Medicos';

vi.mock('../api/apiClient');

test('lista medicos (formato dados)', async () => {
  apiClient.get = vi.fn().mockResolvedValue({
    data: { sucesso: true, dados: [{ id: 1, especialidade: 'Clínica geral', hospital: 'Girassol' }] }
  });
  render(<MemoryRouter><Medicos /></MemoryRouter>);
  await waitFor(() => expect(screen.getByText('Clínica geral')).toBeInTheDocument());
  expect(screen.getByText('Girassol')).toBeInTheDocument();
});
