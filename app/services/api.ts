import Constants from 'expo-constants';
import { Platform } from 'react-native';

const defaultBackendUrl = 'http://localhost:3000';
const hostForAndroid = 'http://10.0.2.2:3000';

const backendConfigUrl =
  Constants.expoConfig?.extra?.backendUrl ||
  Constants.manifest?.extra?.backendUrl;

const BACKEND_URL =
  backendConfigUrl ||
  (Platform.OS === 'android' ? hostForAndroid : defaultBackendUrl);

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'include'
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = body?.error || response.statusText || 'Request failed';
    throw new Error(message);
  }

  return body as T;
}

export async function login(username: string, password: string) {
  return request<{ token: string; user: { id: number; username: string; role: string } }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }
  );
}

export async function register(username: string, password: string, role = 'utente') {
  return request<{ token: string; user: { id: number; username: string; role: string } }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ username, password, role })
    }
  );
}
