import React from 'react';
import { View, Text } from 'react-native';
import { colors, spacing, fontFamily } from '../theme';

// Etiqueta arredondada (condicoes especiais / alergias)
export function Chip({ label }: { label: string }) {
  return (
    <View
      style={{
        backgroundColor: colors.tagBg,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: 20,
      }}
    >
      <Text style={{ color: colors.primary, fontFamily: fontFamily.medium, fontSize: 13 }}>{label}</Text>
    </View>
  );
}
