import React from 'react';
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native';
import { colors, spacing, fontFamily } from '../theme';

type Props = {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
};

export function TextField({ label, value, onChangeText, placeholder, keyboardType, autoCapitalize, error }: Props) {
  return (
    <View style={{ marginTop: spacing.md }}>
      {label ? <Text style={{ color: colors.textSubtle, marginBottom: spacing.xs, fontFamily: fontFamily.regular }}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={'#B9C0C9'}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={{
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.border,
          borderRadius: 8,
          padding: spacing.md,
          fontFamily: fontFamily.regular,
        }}
      />
      {error ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: spacing.xs }}>{error}</Text> : null}
    </View>
  );
}
