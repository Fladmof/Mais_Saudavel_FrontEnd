export interface NormalizedResponse<T> {
  ok: boolean;
  data: T | null;
  message: string;
  /** true quando o pedido nem chegou ao servidor (sem rede / servidor em baixo) */
  network?: boolean;
}

export function normalize<T = any>(raw: any): NormalizedResponse<T> {
  if (raw == null) return { ok: false, data: null, message: 'Resposta vazia' };
  if (typeof raw.success === 'boolean') {
    return { ok: raw.success, data: (raw.data ?? null) as T | null, message: raw.message ?? '' };
  }
  if (typeof raw.sucesso === 'boolean') {
    return { ok: raw.sucesso, data: (raw.dados ?? null) as T | null, message: raw.mensagem ?? '' };
  }
  if (raw.erro === true) {
    return { ok: false, data: null, message: raw.mensagem ?? 'Erro' };
  }
  return { ok: false, data: null, message: 'Formato de resposta desconhecido' };
}
