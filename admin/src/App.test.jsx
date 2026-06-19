import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';

test('App renderiza a marca +Saudavel', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByText(/Saudável/i)).toBeInTheDocument();
});
