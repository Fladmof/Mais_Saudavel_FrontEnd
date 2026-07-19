import React from 'react';
import { View, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';

// Linha rotulo (cinza) / valor (preto) usada nas fichas
export function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <View style={{ marginTop: spacing.sm }}>
      <Text style={[typography.caption, { color: colors.inkSecondary }]}>{label}</Text>
      <Text style={[typography.body, { color: colors.ink }]}>
        {value === null || value === undefined || value === '' ? '—' : String(value)}
      </Text>
    </View>
  );
}
