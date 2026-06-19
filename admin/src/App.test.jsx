import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import App from './App.jsx';

test('rota raiz sem sessao redireciona para o login', () => {
  render(<AuthProvider><MemoryRouter initialEntries={["/"]}><App /></MemoryRouter></AuthProvider>);
  expect(screen.getByText('+Saudável Admin')).toBeInTheDocument();
});
