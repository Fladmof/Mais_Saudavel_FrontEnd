import React from 'react';
import { Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Touchable } from './Touchable';
import { Icon, NomeIcone } from './Icon';
import { colors, spacing, radii, typography } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icone?: NomeIcone;
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
  // `dangerSurface` sobre `background` dá só 1.075:1 — praticamente invisível.
  // A borda torna a ação destrutiva inequívoca, tal como `secondary` já tem.
  danger: {
    backgroundColor: colors.dangerSurface,
    borderWidth: 1,
    borderColor: colors.danger,
  },
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
  // Sem onPress não há ação: um botão focável e anunciado como acionável que
  // não faz nada é pior do que um botão desativado. Trata-se como disabled.
  const semAcao = !onPress;
  const inativo = disabled || loading || semAcao;
  const corTexto = (inativo && !loading ? colors.inkMuted : tinta[variant].color) as string;

  return (
    <Touchable
      onPress={onPress ?? (() => {})}
      disabled={disabled || semAcao}
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
              ...typography.title,
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
