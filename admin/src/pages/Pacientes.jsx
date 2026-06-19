import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

export default function Pacientes() {
  const [lista, setLista] = useState([]);
  const [termo, setTermo] = useState('');

  async function carregar(nome) {
    try {
      const url = nome ? `/utente/search/${encodeURIComponent(nome)}` : '/utente';
      const resp = await apiClient.get(url);
      setLista(resp.data.data.utentes || []);
    } catch (err) {
      if (err.response?.status === 404) setLista([]);
      else console.error('Erro ao listar pacientes:', err.message);
    }
  }

  useEffect(() => { carregar(''); }, []);

  return (
    <div>
      <h1 style={{ color: 'var(--verde)' }}>Pacientes</h1>
      <form onSubmit={(e) => { e.preventDefault(); carregar(termo.trim()); }} style={{ marginBottom: 16 }}>
        <input placeholder="Pesquisar por nome" value={termo} onChange={(e) => setTermo(e.target.value)} style={{ padding: 10, width: 260 }} />
        <button className="btn-verde" type="submit" style={{ marginLeft: 8 }}>Pesquisar</button>
      </form>
      <table>
        <thead><tr><th>Nome</th><th>Email</th><th>Telefone</th><th></th></tr></thead>
        <tbody>
          {lista.map((u) => (
            <tr key={u.id}>
              <td>{u.user?.nome || '—'}</td>
              <td>{u.user?.email || '—'}</td>
              <td>{u.telefone || '—'}</td>
              <td><Link to={`/pacientes/${u.id}`}>Ver</Link></td>
            </tr>
          ))}
          {lista.length === 0 && <tr><td colSpan={4} style={{ color: 'var(--cinza-claro)' }}>Sem pacientes.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
