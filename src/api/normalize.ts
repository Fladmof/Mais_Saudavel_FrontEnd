export interface NormalizedResponse<T> {
  ok: boolean;
  data: T | null;
  message: string;
  /** Código HTTP da resposta (quando chegou ao servidor). Permite tratar 403/409 etc. */
  status?: number;
  /** true quando o pedido nem chegou ao servidor (sem rede / servidor em baixo) */
  network?: boolean;
}

export function normalize<T = any>(raw: any, status?: number): NormalizedResponse<T> {
  if (raw == null) return { ok: false, data: null, message: 'Resposta vazia', status };
  if (typeof raw.success === 'boolean') {
    return { ok: raw.success, data: (raw.data ?? null) as T | null, message: raw.message ?? '', status };
  }
  if (typeof raw.sucesso === 'boolean') {
    return { ok: raw.sucesso, data: (raw.dados ?? null) as T | null, message: raw.mensagem ?? '', status };
  }
  if (raw.erro === true) {
    return { ok: false, data: null, message: raw.mensagem ?? 'Erro', status };
  }
  return { ok: false, data: null, message: 'Formato de resposta desconhecido', status };
}
