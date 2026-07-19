import { luminanciaRelativa, racioContraste } from './contrast';

test('luminância dos extremos', () => {
  expect(luminanciaRelativa('#FFFFFF')).toBeCloseTo(1, 5);
  expect(luminanciaRelativa('#000000')).toBeCloseTo(0, 5);
});

test('preto sobre branco é 21:1', () => {
  expect(racioContraste('#000000', '#FFFFFF')).toBeCloseTo(21, 2);
});

test('a mesma cor é 1:1', () => {
  expect(racioContraste('#1CA625', '#1CA625')).toBeCloseTo(1, 5);
});

test('a ordem dos argumentos não altera o rácio', () => {
  expect(racioContraste('#767676', '#FFFFFF')).toBeCloseTo(
    racioContraste('#FFFFFF', '#767676'),
    5,
  );
});

test('#767676 sobre branco é o limiar AA conhecido (4.54:1)', () => {
  // Valor de referência documentado pelo W3C para texto normal.
  expect(racioContraste('#767676', '#FFFFFF')).toBeCloseTo(4.54, 1);
});

test('aceita forma curta de 3 dígitos', () => {
  expect(racioContraste('#000', '#FFF')).toBeCloseTo(21, 2);
});

test('rejeita hex inválido', () => {
  expect(() => luminanciaRelativa('#20F6591A')).toThrow(/hex inválido/i);
  expect(() => luminanciaRelativa('verde')).toThrow(/hex inválido/i);
});
