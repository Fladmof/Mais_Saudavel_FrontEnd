import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, fontFamily } from '../theme';

type Props = { title: string; onPress: () => void };

// Botao pill verde com seta em circulo branco (padrao dos ecras Inicio/promo do Figma)
export function PillButton({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        width: 234,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.action,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontFamily: fontFamily.bold, fontSize: 18, color: colors.white }}>{title}</Text>
      <View
        style={{
          position: 'absolute',
          right: 6,
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.action, fontSize: 18, fontFamily: fontFamily.bold }}>→</Text>
      </View>
    </TouchableOpacity>
  );
}
