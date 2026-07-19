import React from 'react';
import { View, Text } from 'react-native';
import { colors, fontFamily } from '../theme';

// Circulo com iniciais (ex. "FJ"), como nos cartoes de perfil do Figma
export function Avatar({ nome, size = 48 }: { nome?: string | null; size?: number }) {
  const iniciais = (nome ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.tagBg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontFamily: fontFamily.medium, color: colors.actionInk, fontSize: Math.max(14, size * 0.3) }}>
        {iniciais || '?'}
      </Text>
    </View>
  );
}
