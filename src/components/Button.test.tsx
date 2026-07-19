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

test('a variante primária usa tinta legível sobre o verde de ação', () => {
  const { getByText } = render(<Button title="Entrar" onPress={() => {}} />);
  const cor = estiloDe(getByText('Entrar')).color as string;
  expect(racioContraste(cor, colors.action)).toBeGreaterThanOrEqual(4.5);
});

test('todas as variantes cumprem AA', () => {
  const pares: [string, string][] = [
    [colors.inkOnAction, colors.action], // primary
    [colors.actionInk, colors.surface], // secondary
    [colors.actionInk, colors.background], // ghost
    [colors.danger, colors.dangerSurface], // danger
  ];
  pares.forEach(([tinta, fundo]) =>
    expect(racioContraste(tinta, fundo)).toBeGreaterThanOrEqual(4.5),
  );
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
