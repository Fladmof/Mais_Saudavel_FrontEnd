import React from 'react';
import { View, Text } from 'react-native';
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { colors, spacing, radii, typography, fontFamily } from '../theme';

// Cabecalho das paginas internas: titulo verde + badge "Segurança da informação".
// onSignOut opcional -> mostra um botao "Sair" no canto superior direito.
// onBack opcional -> mostra uma seta de voltar no canto superior esquerdo.
export function PageHeader({ title, onSignOut, onBack }: { title: string; onSignOut?: () => void; onBack?: () => void }) {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingBottom: spacing.lg,
        borderBottomLeftRadius: radii.lg,
        borderBottomRightRadius: radii.lg,
      }}
    >
      {onBack ? (
        <Touchable
          onPress={onBack}
          accessibilityLabel="Voltar"
          style={{ position: 'absolute', left: spacing.lg, top: spacing.md }}
        >
          <Icon nome="arrow-back" tamanho="md" cor={colors.actionInk} />
        </Touchable>
      ) : null}
      <Text style={[typography.h2, { color: colors.actionInk, marginTop: spacing.md }]}>{title}</Text>
      {onSignOut ? (
        <Touchable
          onPress={onSignOut}
          accessibilityLabel="Terminar sessão"
          style={{ position: 'absolute', right: spacing.lg, top: spacing.md }}
        >
          <Text style={{ color: colors.danger, fontFamily: fontFamily.medium }}>Sair</Text>
        </Touchable>
      ) : null}
      <View
        style={{
          backgroundColor: colors.actionInk,
          flexDirection: 'row',
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.xs,
          gap: spacing.xs,
          borderRadius: radii.md,
          marginTop: spacing.lg,
          alignItems: 'center',
        }}
      >
        <Icon nome="shield-checkmark" tamanho="sm" cor={colors.inkInverse} />
        <Text style={{ color: colors.inkInverse, fontFamily: fontFamily.regular }}>Segurança da informação</Text>
      </View>
    </View>
  );
}
