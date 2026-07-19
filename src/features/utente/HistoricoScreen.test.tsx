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

// Achata o `style` de um nó (que pode ser array) num objeto.
function estiloDe(no: { props?: { style?: unknown } }): Record<string, unknown> {
  const s = no.props?.style;
  return Array.isArray(s) ? Object.assign({}, ...s.flat()) : ((s ?? {}) as Record<string, unknown>);
}

// Procura, na subárvore de um nó, o primeiro backgroundColor definido.
// Restringir ao chip é essencial: o badge do PageHeader também usa actionInk,
// e uma busca global encontrá-lo-ia mesmo com o chip revertido para primary.
function fundoNaSubarvore(no: { props?: { style?: unknown }; children?: unknown[] }): string | undefined {
  const bg = estiloDe(no).backgroundColor;
  if (typeof bg === 'string') return bg;
  for (const filho of no.children ?? []) {
    if (filho && typeof filho === 'object') {
      const achado = fundoNaSubarvore(filho as { props?: { style?: unknown }; children?: unknown[] });
      if (achado) return achado;
    }
  }
  return undefined;
}

test('o filtro ativo é legível e anuncia-se como selecionado', async () => {
  mockListar.mockResolvedValue({ ok: true, data: { registos: [] } });
  const { getByLabelText } = render(<HistoricoScreen />);
  const chip = await waitFor(() => getByLabelText(/Filtrar por Todos/i));
  // O chip ativo era fundo `primary` com texto branco: 3.22:1, ilegível ao sol.
  expect(chip.props.accessibilityState).toMatchObject({ selected: true });
});

test('a cor REAL do chip ativo cumpre AA contra a tinta', async () => {
  // Lê o backgroundColor efetivamente aplicado ao chip, dentro da sua subárvore
  // — não os tokens isolados. Senão o teste passaria mesmo com o chip revertido
  // para `primary` (3.22:1), o pior achado desta vaga, que a 5ª regra do lint
  // não apanha por só olhar para `color:`, não `backgroundColor:`.
  mockListar.mockResolvedValue({ ok: true, data: { registos: [] } });
  const { getByLabelText } = render(<HistoricoScreen />);
  const chip = await waitFor(() => getByLabelText(/Filtrar por Todos/i));
  const fundoAtivo = fundoNaSubarvore(chip as never);
  expect(fundoAtivo).toBe(colors.actionInk); // falha se revertido para primary
  expect(racioContraste(colors.inkInverse, fundoAtivo!)).toBeGreaterThanOrEqual(4.5);
});

test('sem registos, o vazio explica-se', async () => {
  mockListar.mockResolvedValue({ ok: true, data: { registos: [] } });
  const { getByText } = render(<HistoricoScreen />);
  await waitFor(() => expect(getByText('Sem registos neste filtro')).toBeTruthy());
});
