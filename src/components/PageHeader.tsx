import React from 'react';
import { View, Text } from 'react-native';
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { colors, spacing, radii, typography, fontFamily } from '../theme';

// Cabecalho das paginas internas: titulo verde + badge "Segurança da informação".
// onSignOut opcional -> mostra um botao "Sair" no canto superior direito.
export function PageHeader({ title, onSignOut }: { title: string; onSignOut?: () => void }) {
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
