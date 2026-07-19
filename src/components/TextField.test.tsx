import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TextField } from './TextField';
import { colors, spacing, racioContraste } from '../theme';

function estiloDe(no: { props: { style: unknown } }) {
  const s = no.props.style;
  return Array.isArray(s) ? Object.assign({}, ...(s as object[]).flat()) : (s as Record<string, unknown>);
}

test('o campo é rotulado para leitores de ecrã', () => {
  const { getByLabelText } = render(
    <TextField label="Nome completo" value="" onChangeText={() => {}} />,
  );
  expect(getByLabelText('Nome completo')).toBeTruthy();
});

test('o limite do campo cumpre 3:1', () => {
  const { getByLabelText } = render(
    <TextField label="Nome" value="" onChangeText={() => {}} />,
  );
  const cor = estiloDe(getByLabelText('Nome')).borderColor as string;
  expect(racioContraste(cor, colors.surface)).toBeGreaterThanOrEqual(3);
});

test('o foco engrossa e colore o limite', () => {
  const { getByLabelText } = render(
    <TextField label="Nome" value="" onChangeText={() => {}} />,
  );
  const campo = getByLabelText('Nome');
  fireEvent(campo, 'focus');
  const estilo = estiloDe(campo);
  expect(estilo.borderColor).toBe(colors.borderFocus);
  expect(estilo.borderWidth).toBe(2);
});

test('o erro é comunicado por texto, e não apenas por cor', () => {
  const { getByText } = render(
    <TextField label="Email" value="x" onChangeText={() => {}} error="Email inválido" />,
  );
  expect(getByText('Email inválido')).toBeTruthy();
});

test('o placeholder é legível', () => {
  const { getByLabelText } = render(
    <TextField label="Nome" value="" onChangeText={() => {}} placeholder="Ex.: Ana Silva" />,
  );
  const cor = getByLabelText('Nome').props.placeholderTextColor as string;
  expect(racioContraste(cor, colors.surface)).toBeGreaterThanOrEqual(4.5);
});

test('respeita o alvo de toque mínimo', () => {
  const { getByLabelText } = render(
    <TextField label="Nome" value="" onChangeText={() => {}} />,
  );
  expect(estiloDe(getByLabelText('Nome')).minHeight).toBe(spacing.touchMin);
});

// Sem este teste, toda a correção de anúncio de erro pode ser revertida com a
// suite verde: o teste de "erro por texto" já passava antes dela existir.
test('o erro entra no nome acessível do campo', () => {
  const { getByLabelText } = render(
    <TextField label="Email" value="x" onChangeText={() => {}} error="Email inválido" />,
  );
  expect(getByLabelText('Email. Erro: Email inválido')).toBeTruthy();
});

test('a linha de erro é uma região viva, para ser anunciada ao aparecer', () => {
  const { UNSAFE_getByProps, queryByText } = render(
    <TextField label="Email" value="x" onChangeText={() => {}} error="Email inválido" />,
  );
  // A região viva só existe quando há erro — no Android é o que faz o
  // TalkBack anunciar a mensagem sem o utilizador voltar ao campo.
  expect(UNSAFE_getByProps({ accessibilityLiveRegion: 'polite' })).toBeTruthy();
  expect(queryByText('Email inválido')).toBeTruthy();
});
