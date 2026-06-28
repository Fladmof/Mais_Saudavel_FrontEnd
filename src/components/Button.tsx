import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, fontFamily } from '../theme';

type Variant = 'primary' | 'outline' | 'ghost';
type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
};

const container: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.action },
  outline: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.danger },
  ghost: { backgroundColor: 'transparent' },
};
const text: Record<Variant, TextStyle> = {
  primary: { color: colors.white },
  outline: { color: colors.danger },
  ghost: { color: colors.primary },
};

export function Button({ title, onPress, variant = 'primary', disabled, loading }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.xl,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        container[variant],
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} />
      ) : (
        <Text style={[{ fontFamily: fontFamily.medium, fontSize: 15, textAlign: 'center' }, text[variant]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
