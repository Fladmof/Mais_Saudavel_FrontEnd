// Cartão de estatística: título, valor grande, ícone e variação vs mês anterior.
export default function StatCard({ titulo, valor, icone, delta, up = true }) {
  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <div>
          <div className="stat-card__titulo">{titulo}</div>
          <div className="stat-card__valor">{valor}</div>
        </div>
        <div className="stat-card__icone">{icone}</div>
      </div>
      {delta != null && (
        <div className="stat-card__delta">
          <span className={up ? 'delta delta-up' : 'delta delta-down'}>
            {up ? '↗' : '↘'} {delta}
          </span>
          <small>vs mês anterior</small>
        </div>
      )}
    </div>
  );
}
