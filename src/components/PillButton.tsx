import React from 'react';
import { Text } from 'react-native';
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { colors, spacing, radii, fontFamily } from '../theme';

type Props = { title: string; onPress: () => void };

// Botao pill verde com seta (padrao dos ecras Inicio/promo do Figma)
export function PillButton({ title, onPress }: Props) {
  return (
    <Touchable
      onPress={onPress}
      accessibilityLabel={title}
      style={{
        alignSelf: 'stretch',
        borderRadius: radii.full,
        backgroundColor: colors.action,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        gap: spacing.sm,
      }}
    >
      <Text style={{ fontFamily: fontFamily.bold, fontSize: 18, color: colors.inkOnAction }}>{title}</Text>
      <Icon nome="arrow-forward" tamanho="sm" cor={colors.inkOnAction} />
    </Touchable>
  );
}
