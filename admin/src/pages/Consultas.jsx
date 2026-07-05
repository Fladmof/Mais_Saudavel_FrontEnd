// Lista de consultas (GET /admin/api/consultas).
import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

const ESTADO = {
  agendada: 'badge-cinza',
  em_curso: 'badge-verde',
  concluida: 'badge-verde',
  cancelada: 'badge-vermelho',
};

export default function Consultas() {
  const [lista, setLista] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    apiClient.get('/admin/api/consultas')
      .then((r) => setLista(r.data.data.consultas))
      .catch((e) => setErro(e.message));
  }, []);

  return (
    <div>
      <h1 className="page-titulo">Consultas</h1>
      {erro && <div className="card" style={{ marginBottom: 16, color: 'var(--vermelho)' }}>Erro ao carregar: {erro}</div>}
      <div className="tabela-wrap">
        <table>
          <thead>
            <tr><th>Data/Hora</th><th>Médico</th><th>Paciente</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {lista.map((c) => (
              <tr key={c.id}>
                <td>{c.data_hora ? new Date(c.data_hora).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
                <td>{c.Medico?.User?.nome || '—'}</td>
                <td>{c.Utente?.User?.nome || '—'}</td>
                <td><span className={`badge ${ESTADO[c.estado] || 'badge-cinza'}`}>{c.estado}</span></td>
              </tr>
            ))}
            {lista.length === 0 && !erro && (
              <tr><td colSpan="4" style={{ color: 'var(--cinza-claro)' }}>Sem consultas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
