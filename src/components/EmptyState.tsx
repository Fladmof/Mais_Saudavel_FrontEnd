import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from './Icon';
import { Button } from './Button';
import { colors, spacing, typography } from '../theme';

type Props = {
  icone: keyof typeof Ionicons.glyphMap;
  titulo: string;
  descricao?: string;
  /** Uma só ação de saída — nunca duas a competir. */
  acao?: { titulo: string; onPress: () => void };
};

export function EmptyState({ icone, titulo, descricao, acao }: Props) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.xxxl, paddingHorizontal: spacing.gutter }}>
      <Icon nome={icone} tamanho="lg" cor={colors.inkMuted} />
      <Text style={{ ...typography.title, color: colors.ink, marginTop: spacing.lg, textAlign: 'center' }}>
        {titulo}
      </Text>
      {descricao ? (
        <Text
          style={{ ...typography.body, color: colors.inkSecondary, marginTop: spacing.sm, textAlign: 'center' }}
        >
          {descricao}
        </Text>
      ) : null}
      {acao ? (
        <View style={{ marginTop: spacing.xl, alignSelf: 'stretch' }}>
          <Button title={acao.titulo} onPress={acao.onPress} />
        </View>
      ) : null}
    </View>
  );
}
