import React from 'react';
import { render } from '@testing-library/react-native';
import { Skeleton } from './Skeleton';

// `accessible` tem de chegar ao nó: em React Native, Views não-tocáveis não
// são elementos de acessibilidade por omissão, pelo que sem esta prop o
// VoiceOver/TalkBack ignora o nó e nunca lê "A carregar" — falhando a razão
// de ser do componente (sinalizar a quem não vê que algo está a chegar).
test('é anunciado a leitores de ecrã como progressbar "A carregar"', () => {
  const { getByLabelText } = render(<Skeleton />);
  const alvo = getByLabelText('A carregar');
  expect(alvo.props.accessible).toBe(true);
  expect(alvo.props.accessibilityRole).toBe('progressbar');
  expect(alvo.props.accessibilityLabel).toBe('A carregar');
});
