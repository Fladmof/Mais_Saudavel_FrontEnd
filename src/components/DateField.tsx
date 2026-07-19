import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { colors, spacing, radii, typography, fontFamily } from '../theme';

type Props = {
  label?: string;
  value: Date | null;
  onChange: (d: Date) => void;
  placeholder?: string;
  error?: string;
  mode?: 'date' | 'time';
  accessibilityHint?: string;
};

function formatar(d: Date, mode: 'date' | 'time') {
  return mode === 'date'
    ? d.toLocaleDateString('pt-PT')
    : d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
}

// Campo de data/hora com o mesmo aspeto do TextField (abre o seletor nativo).
export function DateField({
  label,
  value,
  onChange,
  placeholder,
  error,
  mode = 'date',
  accessibilityHint,
}: Props) {
  const [aberto, setAberto] = useState(false);

  // O seletor aberto é o equivalente ao foco: mesmo tratamento visual do TextField.
  const corLimite = error ? colors.danger : aberto ? colors.borderFocus : colors.borderStrong;
  const rotuloAbrir = mode === 'date' ? 'Escolher data' : 'Escolher hora';
  const rotuloConfirmar = mode === 'date' ? 'Confirmar data selecionada' : 'Confirmar hora selecionada';

  // O accessibilityLabel é o único texto que um leitor de ecrã associa ao
  // campo: sem o erro incluído aqui, o TalkBack lê "Escolher data" mas nunca o erro.
  const rotuloAcessivel = error ? `${rotuloAbrir}. Erro: ${error}` : rotuloAbrir;

  // Sem hint explícito, mantém o comportamento existente (anunciar o valor
  // atual); o hint explícito, quando fornecido pelo ecrã, tem prioridade.
  const dicaAcessivel =
    accessibilityHint ?? (value ? `Valor atual: ${formatar(value, mode)}` : undefined);

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

      <Touchable
        onPress={() => setAberto(true)}
        accessibilityLabel={rotuloAcessivel}
        accessibilityHint={dicaAcessivel}
        style={{
          minHeight: spacing.touchMin,
          justifyContent: 'center',
          borderWidth: aberto || error ? 2 : 1,
          borderColor: corLimite,
          borderRadius: radii.sm,
          paddingHorizontal: spacing.md,
        }}
      >
        <Text style={{ ...typography.body, color: value ? colors.ink : colors.inkMuted }}>
          {value ? formatar(value, mode) : placeholder ?? 'Selecionar…'}
        </Text>
      </Touchable>

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
        <Touchable onPress={() => setAberto(false)} accessibilityLabel={rotuloConfirmar} style={{ alignSelf: 'flex-end' }}>
          <Text style={{ ...typography.title, color: colors.actionInk }}>OK</Text>
        </Touchable>
      ) : null}

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
