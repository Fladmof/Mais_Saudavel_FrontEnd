import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { HistoricoScreen } from './HistoricoScreen';
import { clinicoService } from '../../services/clinicoService';
import { colors, racioContraste } from '../../theme';

jest.mock('../../services/clinicoService');
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { utente: { id: 1 } } }),
}));
jest.mock('expo-router', () => ({
  useFocusEffect: (cb: () => void) => cb(),
  useRouter: () => ({ push: jest.fn() }),
}));

const mockListar = clinicoService.listarRegistos as jest.Mock;

test('o filtro ativo é legível e anuncia-se como selecionado', async () => {
  mockListar.mockResolvedValue({ ok: true, data: { registos: [] } });
  const { getByLabelText } = render(<HistoricoScreen />);
  const chip = await waitFor(() => getByLabelText(/Filtrar por Todos/i));
  // O chip ativo era fundo `primary` com texto branco: 3.22:1, ilegível ao sol.
  expect(chip.props.accessibilityState).toMatchObject({ selected: true });
});

test('o par de cores do filtro ativo cumpre AA', () => {
  // Trava a regressão que a Fase 1 pagou: `primary` + branco falha (3.22:1).
  expect(racioContraste(colors.inkInverse, colors.actionInk)).toBeGreaterThanOrEqual(4.5);
});

test('sem registos, o vazio explica-se', async () => {
  mockListar.mockResolvedValue({ ok: true, data: { registos: [] } });
  const { getByText } = render(<HistoricoScreen />);
  await waitFor(() => expect(getByText('Sem registos neste filtro')).toBeTruthy());
});
