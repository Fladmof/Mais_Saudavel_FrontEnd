// Barra superior do dashboard: saudação, intervalo de datas, notificações e exportar.
export default function TopBar({ nome }) {
  return (
    <div className="topbar">
      <div>
        <h1 className="topbar__titulo">Bem-vindo, <em>{nome || 'Administrador'}</em></h1>
        <p className="topbar__sub">Veja o resumo geral da plataforma</p>
      </div>
      <div className="topbar__acoes">
        <div className="datepill">🗓️ 01/05/2024 - 31/05/2024 ▾</div>
        <button className="bell" title="Notificações">🔔</button>
        <button className="btn-verde">⬇ Exportar Recibo</button>
      </div>
    </div>
  );
}
