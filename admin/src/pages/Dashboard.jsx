// Mais_Saudavel_FrontEnd/admin/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../auth/AuthContext';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import LineChart from '../components/LineChart';
import DonutChart from '../components/DonutChart';

// Serie mensal de consultas (sem fonte no backend -> valores de amostra, como no design).
const SERIE = [
  { label: 'Dez', value: 21 }, { label: 'Jan', value: 34 }, { label: 'Fev', value: 30 },
  { label: 'Mar', value: 64.3664 }, { label: 'Abr', value: 40 }, { label: 'Mai', value: 45 },
  { label: 'Jun', value: 25 }, { label: 'Jul', value: 60 }, { label: 'Ago', value: 52 },
  { label: 'Set', value: 55 }, { label: 'Out', value: 47 }, { label: 'Nov', value: 52 },
];

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('pt-PT') : n ?? '—');

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ utilizadores: '—', pacientes: 0, medicos: 0, consultas: '—' });

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const s = await apiClient.get('/admin/api/stats');
        if (ativo) setStats(s.data.data);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err.message);
      }
    }
    carregar();
    const t = setInterval(carregar, 15000);
    return () => { ativo = false; clearInterval(t); };
  }, []);

  return (
    <div>
      <TopBar nome={user?.nome} />

      <div className="stat-grid">
        <StatCard titulo="Utilizadores Totais" valor={fmt(stats.utilizadores)} icone="👥" delta="8.5%" up />
        <StatCard titulo="Médicos Ativos" valor={fmt(stats.medicos)} icone="📦" delta="1.3%" up />
        <StatCard titulo="Consultas realizadas" valor={fmt(stats.consultas)} icone="📈" delta="4.3%" up={false} />
        <StatCard titulo="Receita Total" valor="50.000 AOA" icone="🕒" delta="1.8%" up />
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-card__head">
            <h3>Consulta realizadas</h3>
            <select className="chart-select" defaultValue="mensal">
              <option value="mensal">Mensal</option>
              <option value="semanal">Semanal</option>
              <option value="anual">Anual</option>
            </select>
          </div>
          <LineChart data={SERIE} />
        </div>

        <div className="chart-card">
          <div className="chart-card__head"><h3>Utilizadores</h3></div>
          <DonutChart pacientes={stats.pacientes} medicos={stats.medicos} />
        </div>
      </div>
    </div>
  );
}
