import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';
import { colors, racioContraste, spacing } from '../theme';

test('mostra o título dentro de um Text e dispara onPress', async () => {
  const onPress = jest.fn();
  const { getByText } = await render(<Button title="Entrar" onPress={onPress} />);
  const label = getByText('Entrar');
  expect(label).toBeTruthy();
  fireEvent.press(label);
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('não dispara onPress quando disabled', async () => {
  const onPress = jest.fn();
  const { getByText } = await render(<Button title="Entrar" onPress={onPress} disabled />);
  fireEvent.press(getByText('Entrar'));
  expect(onPress).not.toHaveBeenCalled();
});

function estiloDe(no: { props: { style: unknown } }) {
  const s = no.props.style;
  return Array.isArray(s) ? Object.assign({}, ...(s as object[]).flat()) : (s as Record<string, unknown>);
}

// Renderiza mesmo cada variante e lê a cor real do nó de texto — ao contrário
// de comparar pares de tokens à parte, isto apanha um erro de MAPEAMENTO
// entre `variant` e o token de tinta (ex.: trocar `danger` por `actionInk`
// no objeto `tinta` não fazia esta suite falhar antes desta correção).
// Substitui tanto o antigo 'todas as variantes cumprem AA' (tautológico:
// nunca renderizava o Button) como 'a variante primária usa tinta legível
// sobre o verde de ação' (o caso 'primary' abaixo cobre-o por inteiro).
test.each([
  ['primary', colors.action],
  ['secondary', colors.surface],
  ['ghost', colors.background],
  ['danger', colors.dangerSurface],
] as const)('a variante %s mapeia para tinta que cumpre AA sobre o seu fundo', (variante, fundo) => {
  const { getByText } = render(<Button title="Ação" variant={variante} onPress={() => {}} />);
  const cor = estiloDe(getByText('Ação')).color as string;
  expect(racioContraste(cor, fundo)).toBeGreaterThanOrEqual(4.5);
});

test('o estado desativado continua legível (não usa opacity 0.5)', () => {
  const { getByText } = render(<Button title="Entrar" onPress={() => {}} disabled />);
  const cor = estiloDe(getByText('Entrar')).color as string;
  expect(racioContraste(cor, colors.surfaceSunken)).toBeGreaterThanOrEqual(4.5);
});

test('o estado de carregamento anuncia-se e bloqueia o toque', () => {
  const onPress = jest.fn();
  const { getByLabelText } = render(
    <Button title="Entrar" onPress={onPress} loading />,
  );
  const alvo = getByLabelText('Entrar');
  expect(alvo.props.accessibilityState).toMatchObject({ busy: true });
  fireEvent.press(alvo);
  expect(onPress).not.toHaveBeenCalled();
});

test('respeita o alvo de toque mínimo', () => {
  const { getByLabelText } = render(<Button title="Entrar" onPress={() => {}} />);
  expect(estiloDe(getByLabelText('Entrar')).minHeight).toBe(spacing.touchMin);
});

test('a variante danger tem um limite visível sobre o fundo da página', () => {
  const { getByLabelText } = render(
    <Button title="Eliminar" variant="danger" onPress={() => {}} />,
  );
  const estilo = estiloDe(getByLabelText('Eliminar'));
  expect(estilo.borderWidth).toBeGreaterThanOrEqual(1);
  expect(racioContraste(estilo.borderColor as string, colors.background)).toBeGreaterThanOrEqual(3);
});
