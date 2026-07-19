import React from 'react';
import { Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { colors, spacing, radii, fontFamily } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icone?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

// `outline` foi removido: era um botão destrutivo com nome de variante neutra,
// o que fazia a ação construtiva e a destrutiva competirem visualmente.
const fundo: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.action },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.dangerSurface },
};

const tinta: Record<Variant, TextStyle> = {
  primary: { color: colors.inkOnAction },
  secondary: { color: colors.actionInk },
  ghost: { color: colors.actionInk },
  danger: { color: colors.danger },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icone,
  accessibilityLabel,
  accessibilityHint,
}: Props) {
  const inativo = disabled || loading;
  const corTexto = (inativo && !loading ? colors.inkMuted : tinta[variant].color) as string;

  return (
    <Touchable
      onPress={onPress ?? (() => {})}
      disabled={disabled}
      busy={loading}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      style={[
        {
          minHeight: spacing.touchMin,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          borderRadius: radii.sm,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: spacing.sm,
        },
        // Desativado mantém contraste legível — `opacity: 0.5` destruía-o.
        inativo && !loading ? { backgroundColor: colors.surfaceSunken } : fundo[variant],
      ]}
    >
      {loading ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <>
          {icone ? <Icon nome={icone} tamanho="sm" cor={corTexto} /> : null}
          <Text
            style={{
              fontFamily: fontFamily.medium,
              fontSize: 16,
              lineHeight: 24,
              textAlign: 'center',
              color: corTexto,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </Touchable>
  );
}
