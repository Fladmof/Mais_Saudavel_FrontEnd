import React from 'react';
import { View, Text } from 'react-native';
import { colors, spacing, radii, typography, fontFamily } from '../theme';

// Etiqueta arredondada (condicoes especiais / alergias)
export function Chip({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: colors.tagBg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radii.md,
      }}
    >
      <Text style={[typography.caption, { color: colors.actionInk, fontFamily: fontFamily.medium }]}>{label}</Text>
    </View>
  );
}
