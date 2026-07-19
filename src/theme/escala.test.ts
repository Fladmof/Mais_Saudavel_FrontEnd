import { typography, radii, spacing, elevation } from './index';

test('a escala tem exatamente 6 níveis', () => {
  expect(Object.keys(typography).sort()).toEqual(
    ['body', 'caption', 'display', 'h1', 'h2', 'title'].sort(),
  );
});

test('todos os níveis têm line-height entre 1.2 e 1.5', () => {
  Object.entries(typography).forEach(([nome, estilo]) => {
    const razao = estilo.lineHeight! / estilo.fontSize!;
    expect(`${nome}:${razao >= 1.2 && razao <= 1.5}`).toBe(`${nome}:true`);
  });
});

test('todos os line-heights assentam na grelha de 4', () => {
  Object.values(typography).forEach((estilo) => {
    expect(estilo.lineHeight! % 4).toBe(0);
  });
});

test('nenhum nível acopla cor — cor é decisão do local de uso', () => {
  Object.values(typography).forEach((estilo) => {
    expect(estilo.color).toBeUndefined();
  });
});

test('o texto nunca desce abaixo de 14px', () => {
  Object.values(typography).forEach((estilo) => {
    expect(estilo.fontSize!).toBeGreaterThanOrEqual(14);
  });
});

test('body sobe para 16px (mínimo confortável para présbitas)', () => {
  expect(typography.body.fontSize).toBe(16);
});

test('os raios reduzem-se a 4 valores', () => {
  expect(radii).toEqual({ sm: 8, md: 12, lg: 16, full: 999 });
});

test('espaçamento inclui os aliases semânticos', () => {
  expect(spacing.gutter).toBe(16);
  expect(spacing.touchMin).toBe(48);
  expect(spacing.xxxl).toBe(40);
});

test('todo o espaçamento assenta na grelha de 4', () => {
  Object.values(spacing).forEach((v) => expect(v % 4).toBe(0));
});

test('elevação tem 3 níveis e `card` não usa sombra', () => {
  expect(Object.keys(elevation).sort()).toEqual(['card', 'none', 'raised']);
  expect((elevation.card as Record<string, unknown>).shadowOpacity).toBeUndefined();
});
