import React from 'react';
import { render } from '@testing-library/react-native';
import { DateField } from './DateField';

test('o campo descreve a ação de abrir o seletor', () => {
  const { getByLabelText } = render(
    <DateField label="Data de nascimento" value={null} onChange={() => {}} />,
  );
  expect(getByLabelText('Escolher data')).toBeTruthy();
});

test('em modo hora, a ação anunciada muda', () => {
  const { getByLabelText } = render(
    <DateField label="Hora" value={null} onChange={() => {}} mode="time" />,
  );
  expect(getByLabelText('Escolher hora')).toBeTruthy();
});

// Ver a nota em TextField.test.tsx: sem isto, a correção de anúncio de erro
// pode ser revertida sem que nenhum teste acuse.
test('o erro entra no nome acessível do campo', () => {
  const { getByLabelText } = render(
    <DateField
      label="Data de nascimento"
      value={null}
      onChange={() => {}}
      error="Data obrigatória"
    />,
  );
  expect(getByLabelText('Escolher data. Erro: Data obrigatória')).toBeTruthy();
});
