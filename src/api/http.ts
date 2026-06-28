import { AxiosRequestConfig } from 'axios';
import { client } from './client';
import { normalize, NormalizedResponse } from './normalize';

function fromError<T>(e: any): NormalizedResponse<T> {
  if (e?.response?.data) return normalize<T>(e.response.data);
  return { ok: false, data: null, message: e?.message ?? 'Erro de rede' };
}

export async function post<T = any>(path: string, body?: any, config?: AxiosRequestConfig): Promise<NormalizedResponse<T>> {
  try {
    const res = await client.post(path, body, config);
    return normalize<T>(res.data);
  } catch (e) {
    return fromError<T>(e);
  }
}

export async function get<T = any>(path: string, config?: AxiosRequestConfig): Promise<NormalizedResponse<T>> {
  try {
    const res = await client.get(path, config);
    return normalize<T>(res.data);
  } catch (e) {
    return fromError<T>(e);
  }
}
