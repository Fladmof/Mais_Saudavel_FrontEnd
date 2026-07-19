import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { colors, spacing, radii, typography, fontFamily } from '../theme';

type Props = {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  error?: string;
  accessibilityHint?: string;
};

export function PasswordField({ label, value, onChangeText, placeholder, error, accessibilityHint }: Props) {
  const [oculta, setOculta] = useState(true);
  const [focado, setFocado] = useState(false);

  // O erro tem três portadores: borda + ícone + texto. Nunca só cor.
  const corLimite = error ? colors.danger : focado ? colors.borderFocus : colors.borderStrong;

  // O accessibilityLabel é o único texto que um leitor de ecrã associa ao
  // input: sem o erro incluído aqui, o TalkBack lê o rótulo mas nunca o erro.
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
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: focado || error ? 2 : 1,
          borderColor: corLimite,
          borderRadius: radii.sm,
          paddingHorizontal: spacing.md,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          placeholder={placeholder}
          placeholderTextColor={colors.inkMuted}
          secureTextEntry={oculta}
          accessibilityLabel={rotuloAcessivel}
          accessibilityHint={accessibilityHint}
          style={{ flex: 1, color: colors.ink, ...typography.body }}
        />
        <Touchable
          onPress={() => setOculta((o) => !o)}
          accessibilityLabel={oculta ? 'Mostrar palavra-passe' : 'Ocultar palavra-passe'}
        >
          <Text style={{ ...typography.caption, color: colors.inkSecondary }}>{oculta ? 'Mostrar' : 'Ocultar'}</Text>
        </Touchable>
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
