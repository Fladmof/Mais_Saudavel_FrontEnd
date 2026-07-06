import { resolveBaseUrl, pickBaseUrl } from './resolveBaseUrl';

test('extrai o host do hostUri do Metro e aplica a porta da API', () => {
  expect(resolveBaseUrl('192.168.8.8:8082', 3000)).toBe('http://192.168.8.8:3000');
});

test('fallback para localhost quando não há hostUri', () => {
  expect(resolveBaseUrl(undefined, 3000)).toBe('http://localhost:3000');
  expect(resolveBaseUrl(null, 3000)).toBe('http://localhost:3000');
});

test('pickBaseUrl prefere o URL hospedado quando definido (sem barra final)', () => {
  expect(pickBaseUrl('https://api.railway.app/', '192.168.8.8:8082', 3000)).toBe('https://api.railway.app');
});

test('pickBaseUrl usa a deteção do Metro quando não há URL hospedado', () => {
  expect(pickBaseUrl('', '192.168.8.8:8082', 3000)).toBe('http://192.168.8.8:3000');
  expect(pickBaseUrl(undefined, null, 3000)).toBe('http://localhost:3000');
});
