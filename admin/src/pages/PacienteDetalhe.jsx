import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import ConfirmDialog from '../components/ConfirmDialog';

export default function PacienteDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [utente, setUtente] = useState(null);
  const [form, setForm] = useState({ telefone: '', morada: '' });
  const [confirmar, setConfirmar] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    apiClient.get(`/utente/${id}`)
      .then((r) => {
        const u = r.data.data.utente;
        setUtente(u);
        setForm({ telefone: u.telefone || '', morada: u.morada || '' });
      })
      .catch((err) => console.error('Erro ao obter paciente:', err.message));
  }, [id]);

  async function guardar(e) {
    e.preventDefault();
    try {
      await apiClient.put(`/utente/${id}`, form);
      setMsg('Guardado com sucesso.');
    } catch (err) {
      setMsg('Erro ao guardar.');
    }
  }

  async function eliminar() {
    try {
      await apiClient.delete(`/utente/${id}`);
      navigate('/pacientes');
    } catch (err) {
      setMsg('Erro ao eliminar.');
      setConfirmar(false);
    }
  }

  if (!utente) return <p>A carregar…</p>;
  return (
    <div>
      <h1 style={{ color: 'var(--verde)' }}>{utente.user?.nome || 'Paciente'}</h1>
      <form className="card" style={{ maxWidth: 480 }} onSubmit={guardar}>
        <label>Telefone</label>
        <input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} style={{ width: '100%', padding: 10, margin: '6px 0 14px' }} />
        <label>Morada</label>
        <input value={form.morada} onChange={(e) => setForm({ ...form, morada: e.target.value })} style={{ width: '100%', padding: 10, margin: '6px 0 14px' }} />
        {msg && <p>{msg}</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-verde" type="submit">Guardar</button>
          <button type="button" className="btn-perigo" onClick={() => setConfirmar(true)}>Eliminar</button>
        </div>
      </form>
      <ConfirmDialog aberto={confirmar} mensagem="Eliminar este paciente?" onConfirmar={eliminar} onCancelar={() => setConfirmar(false)} />
    </div>
  );
}
