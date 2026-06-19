export default function ConfirmDialog({ aberto, mensagem, onConfirmar, onCancelar }) {
  if (!aberto) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: 360 }}>
        <p>{mensagem}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancelar}>Cancelar</button>
          <button className="btn-perigo" onClick={onConfirmar}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
