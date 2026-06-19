// Mais_Saudavel_FrontEnd/admin/src/components/AppShell.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import AppShell from './AppShell';

test('AppShell mostra os links de navegacao', () => {
  render(
    <AuthProvider><MemoryRouter><AppShell><div>conteudo</div></AppShell></MemoryRouter></AuthProvider>
  );
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Pacientes')).toBeInTheDocument();
  expect(screen.getByText('Médicos')).toBeInTheDocument();
  expect(screen.getByText('Sair')).toBeInTheDocument();
});
