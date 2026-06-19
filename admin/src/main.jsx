import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import App from './App.jsx';
import './theme/theme.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/admin">
    <AuthProvider><App /></AuthProvider>
  </BrowserRouter>
);
