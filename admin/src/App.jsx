import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import AppShell from './components/AppShell';
import Placeholder from './components/Placeholder';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Utilizadores from './pages/Utilizadores';
import Pacientes from './pages/Pacientes';
import PacienteDetalhe from './pages/PacienteDetalhe';
import Medicos from './pages/Medicos';
import MedicoDetalhe from './pages/MedicoDetalhe';
import Consultas from './pages/Consultas';
import Documentos from './pages/Documentos';
import Auditoria from './pages/Auditoria';

function Protegido({ children }) {
  return <ProtectedRoute><AppShell>{children}</AppShell></ProtectedRoute>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protegido><Dashboard /></Protegido>} />
      <Route path="/utilizadores" element={<Protegido><Utilizadores /></Protegido>} />
      <Route path="/medicos" element={<Protegido><Medicos /></Protegido>} />
      <Route path="/medicos/:id" element={<Protegido><MedicoDetalhe /></Protegido>} />
      <Route path="/pacientes" element={<Protegido><Pacientes /></Protegido>} />
      <Route path="/pacientes/:id" element={<Protegido><PacienteDetalhe /></Protegido>} />
      <Route path="/consultas" element={<Protegido><Consultas /></Protegido>} />
      <Route path="/documentos" element={<Protegido><Documentos /></Protegido>} />
      <Route path="/unidades" element={<Protegido><Placeholder titulo="Unidades de saúde" /></Protegido>} />
      <Route path="/pagamentos" element={<Protegido><Placeholder titulo="Pagamentos" /></Protegido>} />
      <Route path="/relatorios" element={<Protegido><Placeholder titulo="Relatórios" /></Protegido>} />
      <Route path="/comunicacoes" element={<Protegido><Placeholder titulo="Comunicações" /></Protegido>} />
      <Route path="/configuracoes" element={<Protegido><Placeholder titulo="Configurações" /></Protegido>} />
      <Route path="/auditoria" element={<Protegido><Auditoria /></Protegido>} />
    </Routes>
  );
}
