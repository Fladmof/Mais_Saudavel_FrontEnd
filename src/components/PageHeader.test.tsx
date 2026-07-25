import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PageHeader } from './PageHeader';

it('sem onBack não mostra o botão Voltar', () => {
  const { queryByLabelText } = render(<PageHeader title="Início" />);
  expect(queryByLabelText('Voltar')).toBeNull();
});

it('com onBack mostra Voltar e chama-o ao premir', () => {
  const onBack = jest.fn();
  const { getByLabelText } = render(<PageHeader title="Dados do paciente" onBack={onBack} />);
  fireEvent.press(getByLabelText('Voltar'));
  expect(onBack).toHaveBeenCalled();
});
