// Mais_Saudavel_FrontEnd/admin/src/pages/MedicoDetalhe.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import ConfirmDialog from '../components/ConfirmDialog';

export default function MedicoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medico, setMedico] = useState(null);
  const [form, setForm] = useState({ especialidade: '', hospital: '' });
  const [confirmar, setConfirmar] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    apiClient.get(`/medicos/${id}`)
      .then((r) => {
        const m = r.data.dados;
        setMedico(m);
        setForm({ especialidade: m.especialidade || '', hospital: m.hospital || '' });
      })
      .catch((err) => console.error('Erro ao obter medico:', err.message));
  }, [id]);

  async function guardar(e) {
    e.preventDefault();
    try { await apiClient.put(`/medicos/${id}`, form); setMsg('Guardado com sucesso.'); }
    catch { setMsg('Erro ao guardar.'); }
  }

  async function eliminar() {
    try { await apiClient.delete(`/medicos/${id}`); navigate('/medicos'); }
    catch { setMsg('Erro ao eliminar.'); setConfirmar(false); }
  }

  if (!medico) return <p>A carregar…</p>;
  return (
    <div>
      <h1 style={{ color: 'var(--verde)' }}>{medico.user?.nome || 'Médico'}</h1>
      <form className="card" style={{ maxWidth: 480 }} onSubmit={guardar}>
        <label>Especialidade</label>
        <input value={form.especialidade} onChange={(e) => setForm({ ...form, especialidade: e.target.value })} style={{ width: '100%', padding: 10, margin: '6px 0 14px' }} />
        <label>Hospital</label>
        <input value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} style={{ width: '100%', padding: 10, margin: '6px 0 14px' }} />
        {msg && <p>{msg}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-verde" type="submit">Guardar</button>
          <button type="button" className="btn-perigo" onClick={() => setConfirmar(true)}>Eliminar</button>
        </div>
      </form>
      <ConfirmDialog aberto={confirmar} mensagem="Eliminar este médico?" onConfirmar={eliminar} onCancelar={() => setConfirmar(false)} />
    </div>
  );
}
