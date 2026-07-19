import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Icon } from './Icon';
import { colors, spacing, radii, typography, fontFamily } from '../theme';

type Props = {
  label?: string;
  value: string;
  onValueChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  accessibilityHint?: string;
};

// Campo de escolha com o mesmo aspeto do TextField.
//
// Nota sobre o foco: ao contrário do TextInput, o Picker do
// @react-native-picker/picker só documenta onFocus/onBlur para Android
// (ver typings/Picker.d.ts, "@platform android"). No iOS não há um evento
// fiável de foco a expor aqui — em vez de simular um estado de foco que só
// funcionaria numa plataforma, este campo fica sem esse terceiro estado
// visual e mantém sempre o limite `borderStrong`/`danger`. Ver task-7-report.md.
export function SelectField({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  error,
  accessibilityHint,
}: Props) {
  const corLimite = error ? colors.danger : colors.borderStrong;

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

      <View
        style={{
          minHeight: spacing.touchMin,
          borderWidth: error ? 2 : 1,
          borderColor: corLimite,
          borderRadius: radii.sm,
          justifyContent: 'center',
        }}
      >
        <Picker
          selectedValue={value}
          onValueChange={(v) => onValueChange(String(v))}
          accessibilityLabel={label}
          accessibilityHint={accessibilityHint}
        >
          <Picker.Item label={placeholder ?? 'Selecionar…'} value="" color={colors.inkMuted} />
          {options.map((o) => (
            <Picker.Item key={o} label={o} value={o} />
          ))}
        </Picker>
      </View>

      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs }}>
          <Icon nome="alert-circle" tamanho="sm" cor={colors.danger} />
          <Text style={{ ...typography.caption, color: colors.danger }}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
