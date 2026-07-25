export function idadeDe(datanascimento?: string | null): string {
  if (!datanascimento) return '—';
  const nasc = new Date(datanascimento);
  if (isNaN(nasc.getTime())) return '—';
  const hoje = new Date();
  let anos = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--;
  return `${anos}`;
}

export function imcDe(peso?: number | null, altura?: number | null): string {
  if (!peso || !altura) return '—';
  const v = peso / (altura * altura);
  return isFinite(v) ? v.toFixed(1) : '—';
}

// Deriva o Factor RH do grupo sanguíneo (A+ -> Positivo). '' quando indeterminado.
export function factorRhDe(gsanguineo?: string | null): 'Positivo' | 'Negativo' | '' {
  const s = (gsanguineo ?? '').trim();
  if (s.endsWith('+')) return 'Positivo';
  if (s.endsWith('-')) return 'Negativo';
  return '';
}
