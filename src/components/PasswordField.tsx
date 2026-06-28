import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { colors, spacing, fontFamily } from '../theme';

type Props = {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  error?: string;
};

export function PasswordField({ label, value, onChangeText, placeholder, error }: Props) {
  const [hidden, setHidden] = useState(true);
  return (
    <View style={{ marginTop: spacing.md }}>
      {label ? <Text style={{ color: colors.textSubtle, marginBottom: spacing.xs, fontFamily: fontFamily.regular }}>{label}</Text> : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.border,
          borderRadius: 8,
          paddingHorizontal: spacing.md,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={'#B9C0C9'}
          secureTextEntry={hidden}
          style={{ flex: 1, paddingVertical: spacing.md, fontFamily: fontFamily.regular }}
        />
        <TouchableOpacity onPress={() => setHidden((h) => !h)}>
          <Text style={{ color: colors.textSubtle }}>{hidden ? 'Mostrar' : 'Ocultar'}</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: spacing.xs }}>{error}</Text> : null}
    </View>
  );
}
