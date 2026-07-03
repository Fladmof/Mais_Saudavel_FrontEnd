import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, fontFamily } from '../theme';

type Props = {
  label?: string;
  value: Date | null;
  onChange: (d: Date) => void;
  placeholder?: string;
  error?: string;
  mode?: 'date' | 'time';
};

function formatar(d: Date, mode: 'date' | 'time') {
  return mode === 'date' ? d.toLocaleDateString('pt-PT') : d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
}

// Campo de data/hora com o mesmo aspeto do TextField (abre o picker nativo)
export function DateField({ label, value, onChange, placeholder, error, mode = 'date' }: Props) {
  const [aberto, setAberto] = useState(false);
  return (
    <View style={{ marginTop: spacing.md }}>
      {label ? (
        <Text style={{ color: colors.textSubtle, marginBottom: spacing.xs, fontFamily: fontFamily.regular }}>{label}</Text>
      ) : null}
      <TouchableOpacity
        onPress={() => setAberto(true)}
        style={{
          borderWidth: 1,
          borderColor: error ? colors.danger : colors.border,
          borderRadius: 8,
          padding: spacing.md,
        }}
      >
        <Text style={{ fontFamily: fontFamily.regular, color: value ? colors.black : colors.placeholder }}>
          {value ? formatar(value, mode) : placeholder ?? 'Selecionar…'}
        </Text>
      </TouchableOpacity>
      {aberto ? (
        <DateTimePicker
          value={value ?? new Date(2000, 0, 1)}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_e, d) => {
            setAberto(Platform.OS === 'ios');
            if (d) onChange(d);
          }}
        />
      ) : null}
      {aberto && Platform.OS === 'ios' ? (
        <TouchableOpacity onPress={() => setAberto(false)} style={{ alignSelf: 'flex-end', padding: spacing.sm }}>
          <Text style={{ color: colors.primary, fontFamily: fontFamily.medium }}>OK</Text>
        </TouchableOpacity>
      ) : null}
      {error ? <Text style={{ color: colors.danger, fontSize: 12, marginTop: spacing.xs }}>{error}</Text> : null}
    </View>
  );
}
