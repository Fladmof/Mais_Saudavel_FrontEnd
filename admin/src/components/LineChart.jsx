// Gráfico de linhas em SVG puro (sem dependências). data: [{ label, value 0..100 }].
export default function LineChart({ data = [] }) {
  const W = 680, H = 250, padL = 40, padR = 12, padT = 30, padB = 26;
  const iw = W - padL - padR;
  const ih = H - padT - padB;
  const n = data.length;
  const xs = (i) => padL + (n <= 1 ? 0 : (i * iw) / (n - 1));
  const ys = (v) => padT + ih - (Math.max(0, Math.min(100, v)) / 100) * ih;

  const linePts = data.map((d, i) => `${xs(i)},${ys(d.value)}`).join(' ');
  const areaPts = n ? `${padL},${padT + ih} ${linePts} ${xs(n - 1)},${padT + ih}` : '';
  const gridY = [20, 40, 60, 80, 100];

  let peak = 0;
  data.forEach((d, i) => { if (d.value > (data[peak]?.value ?? -1)) peak = i; });
  const peakX = xs(peak), peakY = ys(data[peak]?.value ?? 0);
  const peakTxt = (data[peak]?.value ?? 0).toFixed(4).replace('.', ',');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Consultas realizadas por mês">
      {gridY.map((g) => (
        <g key={g}>
          <line x1={padL} y1={ys(g)} x2={W - padR} y2={ys(g)} stroke="#EEF1F4" strokeWidth="1" />
          <text x={padL - 8} y={ys(g) + 4} textAnchor="end" fontSize="11" fill="#ABB5BE">{g}%</text>
        </g>
      ))}
      {areaPts && <polygon points={areaPts} fill="rgba(28,166,37,0.10)" />}
      {linePts && <polyline points={linePts} fill="none" stroke="#1CA625" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />}
      {data.map((d, i) => (
        <circle key={i} cx={xs(i)} cy={ys(d.value)} r={i === peak ? 4 : 2.5} fill="#1CA625" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={xs(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="#ABB5BE">{d.label}</text>
      ))}
      {n > 0 && (
        <g>
          <rect x={peakX - 32} y={peakY - 30} width="64" height="20" rx="6" fill="#1CA625" />
          <text x={peakX} y={peakY - 16} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">{peakTxt}</text>
        </g>
      )}
    </svg>
  );
}
