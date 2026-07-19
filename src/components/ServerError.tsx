import React from 'react';
import { View, Text } from 'react-native';
import { Logo } from './Logo';
import { Button } from './Button';
import { Icon } from './Icon';
import { colors, spacing, typography } from '../theme';

type Props = { onRetry?: () => void; message?: string };

// Ecra "Server error" do Figma (500 / Problemas De Conexao) — node 284:780
// Decisão de design: o código HTTP é decorativo, não funcional — o utente
// precisa de saber que a ligação falhou, não que é um "500". Por isso o
// bloco de dígitos deu lugar a um ícone com significado.
export function ServerError({ onRetry, message }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ alignItems: 'center', paddingVertical: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Logo />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
        <Icon nome="cloud-offline-outline" tamanho="lg" cor={colors.inkSecondary} />
        <Text style={[typography.h2, { color: colors.ink, marginTop: spacing.md }]}>Problemas De Conexão</Text>
        <View style={{ marginTop: spacing.xl, alignSelf: 'stretch' }}>
          <Text style={[typography.body, { color: colors.inkSecondary }]}>
            {message ?? 'Desculpe, estamos enfrentando problemas técnicos no momento.'}
          </Text>
          <Text style={[typography.body, { color: colors.inkSecondary, marginTop: spacing.md }]}>Já estamos trabalhando para resolver.</Text>
          <Text style={[typography.body, { color: colors.inkSecondary, marginTop: spacing.xl }]}>Volte mais tarde!</Text>
        </View>
        {onRetry ? (
          <View style={{ alignSelf: 'stretch', marginTop: spacing.xxl }}>
            <Button title="Tentar novamente" onPress={onRetry} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
