import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native';
import { Icon } from './Icon';
import { colors, spacing, radii, typography, fontFamily } from '../theme';

type Props = {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  multiline?: boolean;
  accessibilityHint?: string;
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  error,
  multiline,
  accessibilityHint,
}: Props) {
  const [focado, setFocado] = useState(false);

  // O erro tem três portadores: borda + ícone + texto. Nunca só cor.
  const corLimite = error ? colors.danger : focado ? colors.borderFocus : colors.borderStrong;

  return (
    <View style={{ marginTop: spacing.md }}>
      {label ? (
        <Text
          style={{
            ...typography.caption,
            color: colors.inkSecondary,
            marginBottom: spacing.xs,
            fontFamily: fontFamily.medium,
          }}
        >
          {label}
        </Text>
      ) : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.inkMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        style={{
          minHeight: spacing.touchMin,
          borderWidth: focado || error ? 2 : 1,
          borderColor: corLimite,
          borderRadius: radii.sm,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.md,
          color: colors.ink,
          ...typography.body,
          ...(multiline ? { minHeight: 88, textAlignVertical: 'top' as const } : {}),
        }}
      />

      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs }}>
          <Icon nome="alert-circle" tamanho="sm" cor={colors.danger} />
          <Text style={{ ...typography.caption, color: colors.danger }}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
