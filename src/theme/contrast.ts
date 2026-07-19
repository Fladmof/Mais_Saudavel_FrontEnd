// Cálculo de contraste segundo WCAG 2.1 (https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio).
// Usado nos testes de tokens: uma cor que falhe AA parte o build.

/** Converte '#RGB' ou '#RRGGBB' nos três canais 0..255. */
function canais(hex: string): [number, number, number] {
  const curto = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(hex);
  const longo = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);

  if (curto) {
    return [
      parseInt(curto[1] + curto[1], 16),
      parseInt(curto[2] + curto[2], 16),
      parseInt(curto[3] + curto[3], 16),
    ];
  }
  if (longo) {
    return [parseInt(longo[1], 16), parseInt(longo[2], 16), parseInt(longo[3], 16)];
  }
  // Rejeita 8 dígitos de propósito: foi assim que '#20F6591A' entrou no sistema.
  throw new Error(`hex inválido: ${hex} (esperado #RGB ou #RRGGBB)`);
}

/** Linearização de um canal sRGB (0..255 → 0..1). */
function linearizar(valor255: number): number {
  const c = valor255 / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Luminância relativa WCAG, 0 (preto) a 1 (branco). */
export function luminanciaRelativa(hex: string): number {
  const [r, g, b] = canais(hex);
  return 0.2126 * linearizar(r) + 0.7152 * linearizar(g) + 0.0722 * linearizar(b);
}

/** Rácio de contraste entre duas cores, de 1:1 a 21:1. Independente da ordem. */
export function racioContraste(hexA: string, hexB: string): number {
  const a = luminanciaRelativa(hexA);
  const b = luminanciaRelativa(hexB);
  const clara = Math.max(a, b);
  const escura = Math.min(a, b);
  return (clara + 0.05) / (escura + 0.05);
}
