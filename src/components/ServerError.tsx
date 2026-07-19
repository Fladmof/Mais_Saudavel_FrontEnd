import React from 'react';
import { View, Text } from 'react-native';
import { Logo } from './Logo';
import { Button } from './Button';
import { colors, spacing, typography, fontFamily } from '../theme';

type Props = { onRetry?: () => void; message?: string };

// Ecra "Server error" do Figma (500 / Problemas De Conexao) — node 284:780
export function ServerError({ onRetry, message }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ alignItems: 'center', paddingVertical: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Logo />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[typography.display, { color: colors.primary }]}>5</Text>
          <Text style={[typography.display, { color: colors.action }]}>0</Text>
          <Text style={[typography.display, { color: colors.primary }]}>0</Text>
        </View>
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
