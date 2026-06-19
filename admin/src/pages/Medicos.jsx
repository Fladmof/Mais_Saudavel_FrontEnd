// Mais_Saudavel_FrontEnd/admin/src/pages/Medicos.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

export default function Medicos() {
  const [lista, setLista] = useState([]);
  const [termo, setTermo] = useState('');

  async function carregar(nome) {
    try {
      const url = nome ? `/medicos/search/${encodeURIComponent(nome)}` : '/medicos';
      const resp = await apiClient.get(url);
      setLista(resp.data.dados || []);
    } catch (err) {
      console.error('Erro ao listar medicos:', err.message);
      setLista([]);
    }
  }

  useEffect(() => { carregar(''); }, []);

  return (
    <div>
      <h1 style={{ color: 'var(--verde)' }}>Médicos</h1>
      <form onSubmit={(e) => { e.preventDefault(); carregar(termo.trim()); }} style={{ marginBottom: 16 }}>
        <input placeholder="Pesquisar por nome" value={termo} onChange={(e) => setTermo(e.target.value)} style={{ padding: 10, width: 260 }} />
        <button className="btn-verde" type="submit" style={{ marginLeft: 8 }}>Pesquisar</button>
      </form>
      <table>
        <thead><tr><th>Especialidade</th><th>Hospital</th><th></th></tr></thead>
        <tbody>
          {lista.map((m) => (
            <tr key={m.id}>
              <td>{m.especialidade || '—'}</td>
              <td>{m.hospital || '—'}</td>
              <td><Link to={`/medicos/${m.id}`}>Ver</Link></td>
            </tr>
          ))}
          {lista.length === 0 && <tr><td colSpan={3} style={{ color: 'var(--cinza-claro)' }}>Sem médicos.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
