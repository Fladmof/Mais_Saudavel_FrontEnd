import React from 'react';
import { render } from '@testing-library/react-native';
import { Icon, tamanhosIcone } from './Icon';
import { colors } from '../theme';

test('os tamanhos assentam na grelha de 4', () => {
  Object.values(tamanhosIcone).forEach((t) => expect(t % 4).toBe(0));
});

test('usa md e a tinta principal por omissão', () => {
  const { UNSAFE_getByProps } = render(<Icon nome="camera-outline" />);
  expect(UNSAFE_getByProps({ size: 24 })).toBeTruthy();
  expect(UNSAFE_getByProps({ color: colors.ink })).toBeTruthy();
});

test('é decorativo para leitores de ecrã (o rótulo vive no Touchable)', () => {
  const { UNSAFE_getByProps } = render(<Icon nome="camera-outline" />);
  expect(UNSAFE_getByProps({ accessibilityElementsHidden: true })).toBeTruthy();
});
