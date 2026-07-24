import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from './LoginScreen';

// Prefixo `mock` exigido pelo jest para referenciar a variável dentro da factory
// de jest.mock (que é içada para o topo do módulo).
const mockSignIn = jest.fn(async () => ({ ok: true, message: '' }));
jest.mock('../../context/AuthContext', () => ({ useAuth: () => ({ signIn: mockSignIn }) }));
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

it('faz login com telefone e senha', async () => {
  const { getByPlaceholderText, getByRole } = render(<LoginScreen />);
  fireEvent.changeText(getByPlaceholderText('9XX XXX XXX'), '934000111');
  fireEvent.changeText(getByPlaceholderText('•••••••'), 'teste1234');
  // "Entrar" surge duas vezes (a tab e o botão); alvo pelo papel de botão.
  fireEvent.press(getByRole('button', { name: 'Entrar' }));
  await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith('934000111', 'teste1234'));
});
