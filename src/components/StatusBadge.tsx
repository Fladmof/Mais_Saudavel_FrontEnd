import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from './Icon';
import { colors, spacing, radii, typography } from '../theme';

type Estado = 'agendada' | 'em_curso' | 'concluida' | 'cancelada';

// Substitui os hex inventados nos ecrãs (#E8A200, #4D81E7). Cada estado tem
// cor, ícone E texto — a cor nunca é o único portador de significado.
export const ESTADOS_CONSULTA: Record<
  Estado,
  { rotulo: string; icone: keyof typeof Ionicons.glyphMap; tinta: string; fundo: string }
> = {
  agendada: { rotulo: 'Agendada', icone: 'calendar-outline', tinta: colors.info, fundo: colors.infoSurface },
  em_curso: { rotulo: 'Em curso', icone: 'radio-button-on', tinta: colors.warning, fundo: colors.warningSurface },
  concluida: { rotulo: 'Concluída', icone: 'checkmark-circle', tinta: colors.success, fundo: colors.successSurface },
  cancelada: { rotulo: 'Cancelada', icone: 'close-circle', tinta: colors.danger, fundo: colors.dangerSurface },
};

export function StatusBadge({ estado }: { estado: Estado }) {
  const def = ESTADOS_CONSULTA[estado];
  return (
    <View
      accessible
      accessibilityLabel={`Estado: ${def.rotulo}`}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: spacing.xs,
        backgroundColor: def.fundo,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radii.md,
      }}
    >
      <Icon nome={def.icone} tamanho="sm" cor={def.tinta} />
      <Text style={{ ...typography.caption, color: def.tinta }}>{def.rotulo}</Text>
    </View>
  );
}
