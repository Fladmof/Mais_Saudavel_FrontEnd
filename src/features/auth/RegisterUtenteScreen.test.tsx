import React from 'react';
import { render } from '@testing-library/react-native';
import { RegisterUtenteScreen } from './RegisterUtenteScreen';

jest.mock('../../context/AuthContext', () => ({ useAuth: () => ({ registerUtente: jest.fn() }) }));

it('não mostra o campo Factor RH', () => {
  const { queryByText } = render(<RegisterUtenteScreen />);
  expect(queryByText('Factor RH')).toBeNull();
});
