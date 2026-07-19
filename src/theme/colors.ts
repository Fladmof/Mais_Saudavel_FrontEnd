// Paleta validada a WCAG AA. Os rácios em comentário são o PIOR CASO
// (contra `background`), verificados automaticamente em theme.test.ts.
//
// REGRA DE OURO: `surface` é o que se pinta, `ink` é o que se lê.
// Um token nunca faz as duas coisas.

export const colors = {
  // ── Tinta (texto) ─────────────────────  rácio sobre background #F7F8FA
  ink: '#101418', //          17.2:1 ✅ texto principal
  inkSecondary: '#4A5259', //  7.39:1 ✅ texto de apoio, rótulos
  inkMuted: '#666C73', //      4.94:1 ✅ legendas (era #ABB5BE, 2.08:1)
  inkOnAction: '#0A1A0C', //  11.8:1 ✅ sobre `action` (não sobre background)
  inkInverse: '#FFFFFF', //           ✅ sobre superfícies escuras

  // ── Marca ─────────────────────────────────────
  primary: '#1CA625', //  2.99:1 ⚠️ SÓ ícones e bordas, e SÓ sobre `surface`
  actionInk: '#0E7A16', // 5.12:1 ✅ verde quando é TEXTO
  action: '#0DF205', //    1.53:1 ⛔ NUNCA texto — só preenchimento

  // ── Superfícies ───────────────────────────────
  background: '#F7F8FA', //   o neutro dos 60% (antes por tokenizar, 15 usos)
  surface: '#FFFFFF', //      cartões — 1.08:1 vs background
  surfaceSunken: '#EDF1F3', // campos inativos, esqueletos

  // ── Limites ───────────────────────────────────
  border: '#E3E7EB', //       1.24:1 hairline decorativa (cartões)
  borderStrong: '#7D848C', // 3.52:1 ✅ limites de controlo (inputs, checkbox)
  borderFocus: '#0E7A16', //  5.12:1 ✅ anel de foco, 2px

  // ── Semântica (par superfície + tinta) ────────
  success: '#0E7A16', //        5.12:1 ✅
  successSurface: '#E7F8E8', // par de `success` → 4.93:1 ✅
  warning: '#8A5A00', //        5.51:1 ✅
  warningSurface: '#FDF3D9', // par de `warning` → 5.36:1 ✅
  danger: '#C62828', //         5.23:1 ✅
  dangerSurface: '#FDECEC', //  par de `danger`  → 4.92:1 ✅
  info: '#1B5FBF', //           5.68:1 ✅
  infoSurface: '#E8F0FC', //    par de `info`    → 5.33:1 ✅

  // ── Etiquetas ─────────────────────────────────
  tagBg: '#E7F8E8', // corrige o bug '#20F6591A' (8 díg. = alpha colada)

  // ── Aliases de compatibilidade ────────────────
  // Apontam para os valores NOVOS: os 23 ecrãs herdam contraste acessível
  // sem serem editados. Removidos quando cada ecrã for redesenhado.
  /** @deprecated usar `inkMuted` */
  textMuted: '#666C73',
  /** @deprecated usar `inkSecondary` */
  textSubtle: '#4A5259',
  /** @deprecated usar `inkMuted` */
  placeholder: '#666C73',
  /** @deprecated usar `surface` ou `inkInverse` */
  white: '#FFFFFF',
  /** @deprecated usar `ink` */
  black: '#101418',
} as const;
