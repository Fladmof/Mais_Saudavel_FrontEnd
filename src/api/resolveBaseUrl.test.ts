import { resolveBaseUrl } from './resolveBaseUrl';

test('extrai o host do hostUri do Metro e aplica a porta da API', () => {
  expect(resolveBaseUrl('192.168.8.8:8082', 3000)).toBe('http://192.168.8.8:3000');
});

test('fallback para localhost quando não há hostUri', () => {
  expect(resolveBaseUrl(undefined, 3000)).toBe('http://localhost:3000');
  expect(resolveBaseUrl(null, 3000)).toBe('http://localhost:3000');
});
