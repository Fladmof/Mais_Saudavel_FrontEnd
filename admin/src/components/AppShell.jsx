// Mais_Saudavel_FrontEnd/admin/src/components/AppShell.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const ITENS = [
  { to: '/', label: 'Início', ic: '🏠', end: true },
  { to: '/utilizadores', label: 'Utilizadores', ic: '👥' },
  { to: '/medicos', label: 'Médicos', ic: '🩺' },
  { to: '/pacientes', label: 'Pacientes', ic: '🧑' },
  { to: '/consultas', label: 'Consultas', ic: '📅' },
  { to: '/unidades', label: 'Unidades de saúde', ic: '🏥' },
  { to: '/pagamentos', label: 'Pagamentos', ic: '💳' },
  { to: '/relatorios', label: 'Relatórios', ic: '📊' },
  { to: '/comunicacoes', label: 'Comunicações', ic: '💬' },
  { to: '/configuracoes', label: 'Configurações', ic: '⚙️' },
  { to: '/auditoria', label: 'Auditoria', ic: '🛡️' },
];

function iniciais(nome) {
  return (nome || '?')
    .split(/\s+/).filter(Boolean).slice(0, 2)
    .map((p) => p[0].toUpperCase()).join('') || '?';
}

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cls = ({ isActive }) => (isActive ? 'navitem ativo' : 'navitem');
  return (
    <div className="shell">
      <nav className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__marca"><span>+</span>Saudável</div>
          <div className="sidebar__sub">Registro Médico Pessoal</div>
        </div>
        <div className="sidebar__nav">
          {ITENS.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} className={cls}>
              <span className="navitem__ic">{it.ic}</span>{it.label}
            </NavLink>
          ))}
        </div>
        <div className="sidebar__perfil">
          <div className="sidebar__avatar">{iniciais(user?.nome)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar__perfil-nome">{user?.nome || 'Administrador'}</div>
            <div className="sidebar__perfil-meta">Administrador</div>
            <div className="sidebar__perfil-meta">{user?.email || ''}</div>
          </div>
          <button className="sidebar__sair" title="Sair" onClick={() => { logout(); navigate('/login'); }}>⎋</button>
        </div>
      </nav>
      <main className="conteudo">{children}</main>
    </div>
  );
}
