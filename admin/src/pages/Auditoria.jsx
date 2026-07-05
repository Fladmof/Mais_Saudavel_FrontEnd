// Registo de auditoria (GET /admin/api/activity).
import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

export default function Auditoria() {
  const [eventos, setEventos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    apiClient.get('/admin/api/activity')
      .then((r) => setEventos(r.data.data.eventos))
      .catch((e) => setErro(e.message));
  }, []);

  return (
    <div>
      <h1 className="page-titulo">Auditoria</h1>
      {erro && <div className="card" style={{ marginBottom: 16, color: 'var(--vermelho)' }}>Erro ao carregar: {erro}</div>}
      <div className="tabela-wrap">
        <table>
          <thead>
            <tr><th>Ação</th><th>Alvo</th><th>Quando</th></tr>
          </thead>
          <tbody>
            {eventos.map((ev) => (
              <tr key={ev.id}>
                <td><strong>{ev.action}</strong></td>
                <td>{ev.target_name || ev.target_type || '—'}</td>
                <td>{ev.createdAt ? new Date(ev.createdAt).toLocaleString('pt-PT') : '—'}</td>
              </tr>
            ))}
            {eventos.length === 0 && !erro && (
              <tr><td colSpan="3" style={{ color: 'var(--cinza-claro)' }}>Sem atividade registada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
