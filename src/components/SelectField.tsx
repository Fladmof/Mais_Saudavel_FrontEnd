import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, fontFamily } from '../theme';

type Props = {
  label?: string;
  value: string;
  onValueChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
};

// Campo de escolha com o mesmo aspeto do TextField
export function SelectField({ label, value, onValueChange, options, placeholder, error }: Props) {
  return (
    <View style={{ marginTop: spacing.md }}>
      {label ? (
        <Text style={{ color: colors.textSubtle, marginBottom: spacing.xs, fontFamily: fontFamily.regular }}>{label}</Text>
      ) : null}
      <View
        style={{
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.border,
          borderRadius: 8,
          justifyContent: 'center',
        }}
      >
        <Picker selectedValue={value} onValueChange={(v) => onValueChange(String(v))}>
          <Picker.Item label={placeholder ?? 'Selecionar…'} value="" color={colors.placeholder} />
          {options.map((o) => (
            <Picker.Item key={o} label={o} value={o} />
          ))}
        </Picker>
      </View>
      {error ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: spacing.xs }}>{error}</Text> : null}
    </View>
  );
}
