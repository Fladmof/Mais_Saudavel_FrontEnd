// Mais_Saudavel_FrontEnd/admin/src/components/AppShell.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function AppShell({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const cls = ({ isActive }) => (isActive ? 'ativo' : undefined);
  return (
    <div className="shell">
      <nav className="sidebar">
        <div className="marca">+Saudável</div>
        <NavLink to="/" end className={cls}>Dashboard</NavLink>
        <NavLink to="/pacientes" className={cls}>Pacientes</NavLink>
        <NavLink to="/medicos" className={cls}>Médicos</NavLink>
        <button className="sair" onClick={() => { logout(); navigate('/login'); }}>Sair</button>
      </nav>
      <main className="conteudo">{children}</main>
    </div>
  );
}
