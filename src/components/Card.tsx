import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { colors, spacing, radii, elevation } from '../theme';

// Cartao branco arredondado usado nas fichas/listas (padrao do Figma)
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        { backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg, ...elevation.card },
        style,
      ]}
    >
      {children}
    </View>
  );
}
