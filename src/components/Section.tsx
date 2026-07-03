import React from 'react';
import { View, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';

type Props = { title: string; children: React.ReactNode };

// Titulo verde de seccao usado nos formularios e fichas (padrao do Figma)
export function Section({ title, children }: Props) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <Text style={[typography.title, { color: colors.primary, marginBottom: spacing.sm }]}>{title}</Text>
      {children}
    </View>
  );
}
