import Constants from 'expo-constants';

export const API_PORT = 3000; // se o backend correr noutra porta em dev (ex. 3001), mudar aqui

export function resolveBaseUrl(hostUri?: string | null, port: number = API_PORT): string {
  const host = hostUri ? hostUri.split(':')[0] : null;
  if (host) return `http://${host}:${port}`;
  return `http://localhost:${port}`;
}

export const BASE_URL = resolveBaseUrl(Constants.expoConfig?.hostUri, API_PORT);
