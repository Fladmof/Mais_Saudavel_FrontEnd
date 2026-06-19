// Mais_Saudavel_FrontEnd/admin/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const [stats, setStats] = useState({ pacientes: '—', medicos: '—' });
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const [s, a] = await Promise.all([
          apiClient.get('/admin/api/stats'),
          apiClient.get('/admin/api/activity')
        ]);
        if (!ativo) return;
        setStats(s.data.data);
        setEventos(a.data.data.eventos);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err.message);
      }
    }
    carregar();
    const t = setInterval(carregar, 15000); // polling
    return () => { ativo = false; clearInterval(t); };
  }, []);

  return (
    <div>
      <h1 style={{ color: 'var(--verde)' }}>Dashboard</h1>
      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        <StatCard titulo="Pacientes" valor={stats.pacientes} />
        <StatCard titulo="Médicos" valor={stats.medicos} />
      </div>
      <h2>Atividade recente</h2>
      <div className="card">
        {eventos.length === 0 && <p style={{ color: 'var(--cinza-claro)' }}>Sem atividade registada.</p>}
        {eventos.map((ev) => (
          <div key={ev.id} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <strong>{ev.action}</strong> — {ev.target_name || '—'}{' '}
            <span style={{ color: 'var(--cinza-claro)' }}>{new Date(ev.createdAt).toLocaleString('pt-PT')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
