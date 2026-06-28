import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

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
