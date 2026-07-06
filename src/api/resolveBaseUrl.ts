import Constants from 'expo-constants';

export const API_PORT = 3000; // se o backend correr noutra porta em dev (ex. 3001), mudar aqui

export function resolveBaseUrl(hostUri?: string | null, port: number = API_PORT): string {
  const host = hostUri ? hostUri.split(':')[0] : null;
  if (host) return `http://${host}:${port}`;
  return `http://localhost:${port}`;
}

// Escolhe a base da API:
//  1) se houver um URL hospedado explicito (EXPO_PUBLIC_API_URL, ex. Railway), usa-o;
//  2) caso contrario, deteta o host do Metro (dev local, sem IP fixo).
export function pickBaseUrl(hostedUrl?: string | null, hostUri?: string | null, port: number = API_PORT): string {
  const hosted = (hostedUrl ?? '').trim().replace(/\/+$/, '');
  if (hosted) return hosted;
  return resolveBaseUrl(hostUri, port);
}

export const BASE_URL = pickBaseUrl(process.env.EXPO_PUBLIC_API_URL, Constants.expoConfig?.hostUri, API_PORT);
