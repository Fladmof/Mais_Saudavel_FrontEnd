import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { MedicoHomeScreen } from './MedicoHomeScreen';
import { consultaService } from '../../services/consultaService';
import { utenteService } from '../../services/utenteService';

jest.mock('../../services/consultaService');
jest.mock('../../services/utenteService');
jest.mock('../../services/notificacaoService');
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { nome: 'Dra. Ana', medico: { especialidade: 'Cardiologia' } }, signOut: jest.fn() }),
}));
jest.mock('expo-router', () => ({
  useFocusEffect: (cb: () => void) => cb(),
  useRouter: () => ({ push: jest.fn() }),
}));

beforeEach(() => {
  (utenteService.listarUtentes as jest.Mock).mockResolvedValue({ ok: true, data: { utentes: [] } });
});

test('o estado da consulta é anunciado por texto (StatusBadge), não só por cor', async () => {
  (consultaService.minhasConsultas as jest.Mock).mockResolvedValue({
    ok: true,
    data: { consultas: [{ id: 1, estado: 'em_curso', data_hora: '2026-08-01T09:00:00Z', utente: { user: { nome: 'João' } } }] },
  });
  const { getByText } = render(<MedicoHomeScreen />);
  await waitFor(() => expect(getByText('Em curso')).toBeTruthy());
  // Ação da consulta em curso é "Retomar"
  expect(getByText('Retomar')).toBeTruthy();
});

test('sem consultas mostra o estado vazio', async () => {
  (consultaService.minhasConsultas as jest.Mock).mockResolvedValue({ ok: true, data: { consultas: [] } });
  const { findByText } = render(<MedicoHomeScreen />);
  expect(await findByText('Sem consultas marcadas')).toBeTruthy();
});
