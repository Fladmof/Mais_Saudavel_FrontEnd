import React from 'react';
import { View, Text } from 'react-native';
import { colors, spacing, fontFamily } from '../theme';

// Linha rotulo (cinza) / valor (preto) usada nas fichas
export function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <View style={{ marginTop: spacing.sm }}>
      <Text style={{ color: colors.textMuted, fontSize: 13, fontFamily: fontFamily.regular }}>{label}</Text>
      <Text style={{ color: colors.black, fontSize: 15, fontFamily: fontFamily.regular }}>
        {value === null || value === undefined || value === '' ? '—' : String(value)}
      </Text>
    </View>
  );
}
