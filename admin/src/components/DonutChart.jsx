// Donut em SVG puro. Dois segmentos: pacientes (verde escuro) e médicos (verde claro).
export default function DonutChart({ pacientes = 0, medicos = 0 }) {
  const total = (pacientes + medicos) || 1;
  const r = 66, sw = 22, cx = 90, cy = 90;
  const c = 2 * Math.PI * r;
  const fracP = pacientes / total;
  const dashP = `${fracP * c} ${c}`;

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 180 180" width="170" height="170" role="img" aria-label="Distribuição de utilizadores">
        <g transform="rotate(-90 90 90)">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#BFE6C2" strokeWidth={sw} />
          <circle
            cx={cx} cy={cy} r={r} fill="none"
            stroke="#1CA625" strokeWidth={sw}
            strokeDasharray={dashP} strokeLinecap="round"
          />
        </g>
      </svg>
      <div className="donut-legend">
        <div>
          <div className="num">{pacientes}</div>
          <div className="lab"><span className="dot" style={{ background: '#1CA625' }} /> Pacientes</div>
        </div>
        <div>
          <div className="num">{medicos}</div>
          <div className="lab"><span className="dot" style={{ background: '#BFE6C2' }} /> Médicos</div>
        </div>
      </div>
    </div>
  );
}
