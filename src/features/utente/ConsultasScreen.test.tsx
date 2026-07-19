import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ConsultasScreen } from './ConsultasScreen';
import { consultaService } from '../../services/consultaService';

jest.mock('../../services/consultaService');
jest.mock('expo-router', () => ({
  useFocusEffect: (cb: () => void) => cb(),
  router: { push: jest.fn() },
}));

const mockListar = consultaService.minhasConsultas as jest.Mock;

test('sem consultas, o vazio oferece a saída certa', async () => {
  mockListar.mockResolvedValue({ ok: true, data: { consultas: [] } });
  const { getByText } = render(<ConsultasScreen />);
  await waitFor(() => expect(getByText('Ainda não tem consultas marcadas')).toBeTruthy());
  // Um vazio acionável leva botão; o de "Alertas" não leva, porque não ter
  // alertas é boa notícia.
  expect(getByText('Marcar consulta')).toBeTruthy();
});

test('o estado da consulta é anunciado por texto, não só por cor', async () => {
  mockListar.mockResolvedValue({
    ok: true,
    data: {
      consultas: [
        { id: 7, estado: 'em_curso', data_hora: '2026-07-20T10:00:00Z', medico: { nome: 'Ana Dias' } },
      ],
    },
  });
  const { getByText } = render(<ConsultasScreen />);
  // Vem do StatusBadge, não de um mapa de cores local.
  await waitFor(() => expect(getByText('Em curso')).toBeTruthy());
});
