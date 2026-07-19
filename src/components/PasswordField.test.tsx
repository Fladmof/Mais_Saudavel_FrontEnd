import React from 'react';
import { render } from '@testing-library/react-native';
import { PasswordField } from './PasswordField';

test('o campo é rotulado para leitores de ecrã', () => {
  const { getByLabelText } = render(
    <PasswordField label="Palavra-passe" value="" onChangeText={() => {}} />,
  );
  expect(getByLabelText('Palavra-passe')).toBeTruthy();
});

// Ver a nota em TextField.test.tsx: sem isto, a correção de anúncio de erro
// pode ser revertida sem que nenhum teste acuse.
test('o erro entra no nome acessível do campo', () => {
  const { getByLabelText } = render(
    <PasswordField
      label="Palavra-passe"
      value="123"
      onChangeText={() => {}}
      error="Mínimo 8 caracteres"
    />,
  );
  expect(getByLabelText('Palavra-passe. Erro: Mínimo 8 caracteres')).toBeTruthy();
});

test('o botão de mostrar/ocultar descreve a ação, não o aspeto', () => {
  const { getByLabelText } = render(
    <PasswordField label="Palavra-passe" value="segredo" onChangeText={() => {}} />,
  );
  expect(getByLabelText('Mostrar palavra-passe')).toBeTruthy();
});
