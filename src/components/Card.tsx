import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { colors, spacing } from '../theme';

// Cartao branco arredondado usado nas fichas/listas (padrao do Figma)
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
        style,
      ]}
    >
      {children}
    </View>
  );
}
