import { normalize } from './normalize';

test('envelope responseFormatter {success,data}', () => {
  const r = normalize({ success: true, status: 200, message: 'ok', data: { token: 'abc' } });
  expect(r).toEqual({ ok: true, data: { token: 'abc' }, message: 'ok' });
});

test('envelope medico/user {sucesso,dados}', () => {
  const r = normalize({ sucesso: true, mensagem: 'feito', dados: [1, 2] });
  expect(r).toEqual({ ok: true, data: [1, 2], message: 'feito' });
});

test('erro {erro:true,mensagem}', () => {
  const r = normalize({ erro: true, mensagem: 'falhou' });
  expect(r).toEqual({ ok: false, data: null, message: 'falhou' });
});

test('nulo é falha', () => {
  expect(normalize(null).ok).toBe(false);
});
