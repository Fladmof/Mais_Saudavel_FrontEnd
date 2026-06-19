import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import AppShell from './components/AppShell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pacientes from './pages/Pacientes';
import PacienteDetalhe from './pages/PacienteDetalhe';
import Medicos from './pages/Medicos';
import MedicoDetalhe from './pages/MedicoDetalhe';

function Protegido({ children }) {
  return <ProtectedRoute><AppShell>{children}</AppShell></ProtectedRoute>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protegido><Dashboard /></Protegido>} />
      <Route path="/pacientes" element={<Protegido><Pacientes /></Protegido>} />
      <Route path="/pacientes/:id" element={<Protegido><PacienteDetalhe /></Protegido>} />
      <Route path="/medicos" element={<Protegido><Medicos /></Protegido>} />
      <Route path="/medicos/:id" element={<Protegido><MedicoDetalhe /></Protegido>} />
    </Routes>
  );
}
