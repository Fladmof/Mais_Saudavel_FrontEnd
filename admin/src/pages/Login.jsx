// Mais_Saudavel_FrontEnd/admin/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [aLigar, setALigar] = useState(false);

  async function submeter(e) {
    e.preventDefault();
    setErro(null);
    setALigar(true);
    try {
      await login(email, senha);
      navigate('/');
    } catch (err) {
      setErro(err?.message || 'Falha no login');
    } finally {
      setALigar(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form className="card" style={{ width: 360 }} onSubmit={submeter}>
        <h1 style={{ color: 'var(--verde)' }}>+Saudável Admin</h1>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
               style={{ width: '100%', padding: 10, margin: '6px 0 14px' }} />
        <label htmlFor="senha">Senha</label>
        <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
               style={{ width: '100%', padding: 10, margin: '6px 0 14px' }} />
        {erro && <p style={{ color: '#FF383C' }}>{erro}</p>}
        <button className="btn-verde" type="submit" disabled={aLigar} style={{ width: '100%' }}>
          {aLigar ? 'A entrar…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
