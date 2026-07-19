import { colors, spacing, typography } from './index';
import { racioContraste } from './contrast';

// ── Contraste: o build parte se um par declarado falhar AA ──────────────

test('tinta sobre o fundo da página cumpre AA (4.5:1)', () => {
  expect(racioContraste(colors.ink, colors.background)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.inkSecondary, colors.background)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.inkMuted, colors.background)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.actionInk, colors.background)).toBeGreaterThanOrEqual(4.5);
});

test('tinta sobre cartão branco cumpre AA (4.5:1)', () => {
  expect(racioContraste(colors.ink, colors.surface)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.inkSecondary, colors.surface)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.inkMuted, colors.surface)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.actionInk, colors.surface)).toBeGreaterThanOrEqual(4.5);
});

test('inkOnAction é medido sobre action, não sobre o fundo', () => {
  // Armadilha registada na spec §7: comparar com background dá falso negativo.
  expect(racioContraste(colors.inkOnAction, colors.action)).toBeGreaterThanOrEqual(4.5);
});

test('cada cor semântica cumpre AA sobre a sua própria superfície', () => {
  expect(racioContraste(colors.success, colors.successSurface)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.warning, colors.warningSurface)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.danger, colors.dangerSurface)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.info, colors.infoSurface)).toBeGreaterThanOrEqual(4.5);
});

test('cada cor semântica cumpre AA sobre o fundo da página', () => {
  expect(racioContraste(colors.success, colors.background)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.warning, colors.background)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.danger, colors.background)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.info, colors.background)).toBeGreaterThanOrEqual(4.5);
});

test('limites de controlo cumprem 3:1 no pior caso', () => {
  expect(racioContraste(colors.borderStrong, colors.background)).toBeGreaterThanOrEqual(3);
  expect(racioContraste(colors.borderStrong, colors.surface)).toBeGreaterThanOrEqual(3);
  expect(racioContraste(colors.borderFocus, colors.background)).toBeGreaterThanOrEqual(3);
});

test('action é cor de preenchimento, nunca de texto', () => {
  // Documenta a razão de existir inkOnAction: branco sobre action é ilegível.
  expect(racioContraste('#FFFFFF', colors.action)).toBeLessThan(3);
});

test('primary serve ícones e bordas, nunca texto normal', () => {
  // Limítrofe por construção: cumpre 3:1 para ícones e limites…
  expect(racioContraste(colors.primary, colors.background)).toBeGreaterThanOrEqual(3);
  expect(racioContraste(colors.primary, colors.surface)).toBeGreaterThanOrEqual(3);
  // …mas NÃO cumpre 4.5:1, e por isso não é cor de texto. Verde-texto é `actionInk`.
  expect(racioContraste(colors.primary, colors.background)).toBeLessThan(4.5);
});

// ── Aliases de compatibilidade ──────────────────────────────────────────

test('os nomes antigos apontam para os valores NOVOS e acessíveis', () => {
  expect(colors.textMuted).toBe(colors.inkMuted);
  expect(colors.textSubtle).toBe(colors.inkSecondary);
  expect(colors.placeholder).toBe(colors.inkMuted);
  expect(racioContraste(colors.textMuted, colors.background)).toBeGreaterThanOrEqual(4.5);
  expect(racioContraste(colors.placeholder, colors.surface)).toBeGreaterThanOrEqual(4.5);
});

test('nenhum token usa hex de 8 dígitos', () => {
  // tagBg era '#20F6591A' — alpha colada por engano.
  Object.entries(colors).forEach(([nome, valor]) => {
    expect(`${nome}=${valor}`).toMatch(/=#[0-9a-fA-F]{3}$|=#[0-9a-fA-F]{6}$/);
  });
});

// ── Escala e tipografia ─────────────────────────────────────────────────

test('escala de espaçamento base-4', () => {
  expect(spacing.md).toBe(12);
  expect(spacing.xl).toBe(24);
});

test('tipografia usa Space Grotesk', () => {
  expect(typography.body.fontFamily).toBe('SpaceGrotesk_400Regular');
  expect(typography.title.fontFamily).toBe('SpaceGrotesk_500Medium');
});
