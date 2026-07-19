import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { AlertasScreen } from './AlertasScreen';
import { notificacaoService } from '../../services/notificacaoService';

jest.mock('../../services/notificacaoService');
jest.mock('expo-router', () => ({ useFocusEffect: (cb: () => void) => cb() }));

const mockListar = notificacaoService.listar as jest.Mock;

test('sem alertas, mostra o estado vazio explicado', async () => {
  mockListar.mockResolvedValue({ ok: true, data: { notificacoes: [] } });
  const { getByText } = render(<AlertasScreen />);
  await waitFor(() => expect(getByText('Sem alertas')).toBeTruthy());
  // O vazio explica-se: uma caixa com duas palavras não distingue
  // "está tudo bem" de "algo falhou".
  expect(getByText('Avisamos aqui quando houver novidades sobre as suas consultas.')).toBeTruthy();
});

test('uma notificação não lida anuncia esse estado a leitores de ecrã', async () => {
  mockListar.mockResolvedValue({
    ok: true,
    data: {
      notificacoes: [
        { id: 1, title: 'Consulta amanhã', message: 'Às 10h', is_read: false, createdAt: '2026-07-19T10:00:00Z' },
      ],
    },
  });
  const { getByLabelText } = render(<AlertasScreen />);
  // O estado "não lida" não pode viver só no ponto colorido.
  await waitFor(() => expect(getByLabelText(/não lida/i)).toBeTruthy());
});
