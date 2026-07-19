import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export const tamanhosIcone = { sm: 16, md: 24, lg: 32 } as const;

/** Único ponto de verdade para nomes de ícone: evita repetir `keyof typeof Ionicons.glyphMap`. */
export type NomeIcone = keyof typeof Ionicons.glyphMap;

type Props = {
  nome: NomeIcone;
  tamanho?: keyof typeof tamanhosIcone;
  cor?: string;
};

// Único caminho para ícones na app. Emoji não são ícones: renderizam de forma
// diferente por versão de Android e não são anunciados de forma útil.
// O ícone é decorativo — quem carrega o rótulo é o `Touchable` que o envolve.
export function Icon({ nome, tamanho = 'md', cor = colors.ink }: Props) {
  return (
    <Ionicons
      name={nome}
      size={tamanhosIcone[tamanho]}
      color={cor}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}
