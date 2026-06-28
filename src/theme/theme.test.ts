import { colors, spacing, typography } from './index';

test('cores chave do Figma', () => {
  expect(colors.primary).toBe('#1CA625');
  expect(colors.action).toBe('#0DF205');
  expect(colors.danger).toBe('#FF383C');
});

test('escala de espaçamento base-4', () => {
  expect(spacing.md).toBe(12);
  expect(spacing.xl).toBe(24);
});

test('tipografia usa Space Grotesk', () => {
  expect(typography.body.fontFamily).toBe('SpaceGrotesk_400Regular');
  expect(typography.title.fontFamily).toBe('SpaceGrotesk_500Medium');
});
