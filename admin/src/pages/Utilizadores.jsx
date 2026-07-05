// Lista de todos os utilizadores (GET /admin/api/users).
import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const BADGE = { admin: 'badge-vermelho', medico: 'badge-verde', utente: 'badge-cinza', user: 'badge-cinza' };

export default function Utilizadores() {
  const [lista, setLista] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    apiClient.get('/admin/api/users')
      .then((r) => setLista(r.data.data.utilizadores))
      .catch((e) => setErro(e.message));
  }, []);

  return (
    <div>
      <h1 className="page-titulo">Utilizadores</h1>
      {erro && <div className="card" style={{ marginBottom: 16, color: 'var(--vermelho)' }}>Erro ao carregar: {erro}</div>}
      <div className="tabela-wrap">
        <table>
          <thead>
            <tr><th>Nome</th><th>Email</th><th>Tipo</th><th>Registado</th></tr>
          </thead>
          <tbody>
            {lista.map((u) => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td><span className={`badge ${BADGE[u.role] || 'badge-cinza'}`}>{u.role}</span></td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-PT') : '—'}</td>
              </tr>
            ))}
            {lista.length === 0 && !erro && (
              <tr><td colSpan="4" style={{ color: 'var(--cinza-claro)' }}>Sem utilizadores.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
