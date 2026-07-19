import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
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
// Nota sobre o foco: o Picker do @react-native-picker/picker só documenta
// onFocus/onBlur para Android (ver typings/Picker.d.ts, "@platform android");
// os typings instalados não declaram equivalente para iOS. Decisão do
// controlador: o público-alvo desta app é maioritariamente Android de gama
// baixa/média, logo foco real no Android vale mais do que nenhum foco em
// lado nenhum. O estado `focado` liga sempre a onFocus/onBlur (tal como no
// TextField), mas só influencia o limite quando `Platform.OS === 'android'`.
// No iOS o campo permanece sempre no estado de repouso (`borderStrong`,
// 1px) — nunca um foco falso. Isto é uma restrição dos typings do Picker,
// não uma omissão da implementação.
export function SelectField({
  label,
  value,
  onValueChange,
  options,
  placeholder,
  error,
  accessibilityHint,
}: Props) {
  const [focado, setFocado] = useState(false);
  const focoAtivo = focado && Platform.OS === 'android';

  const corLimite = error ? colors.danger : focoAtivo ? colors.borderFocus : colors.borderStrong;

  // O accessibilityLabel é o único texto que um leitor de ecrã associa ao
  // Picker: sem o erro incluído aqui, o TalkBack lê o rótulo mas nunca o erro.
  const rotuloAcessivel = error ? (label ? `${label}. Erro: ${error}` : `Erro: ${error}`) : label;

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
          borderWidth: focoAtivo || error ? 2 : 1,
          borderColor: corLimite,
          borderRadius: radii.sm,
          justifyContent: 'center',
        }}
      >
        <Picker
          selectedValue={value}
          onValueChange={(v) => onValueChange(String(v))}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          accessibilityLabel={rotuloAcessivel}
          accessibilityHint={accessibilityHint}
        >
          <Picker.Item label={placeholder ?? 'Selecionar…'} value="" color={colors.inkMuted} />
          {options.map((o) => (
            <Picker.Item key={o} label={o} value={o} />
          ))}
        </Picker>
      </View>

      {error ? (
        <View
          accessibilityLiveRegion="polite"
          style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs }}
        >
          <Icon nome="alert-circle" tamanho="sm" cor={colors.danger} />
          <Text style={{ ...typography.caption, color: colors.danger }}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
