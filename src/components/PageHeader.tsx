import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, fontFamily } from '../theme';

// Cabecalho das paginas internas: titulo verde + badge "Segurança da informação".
// onSignOut opcional -> mostra um botao "Sair" no canto superior direito.
export function PageHeader({ title, onSignOut }: { title: string; onSignOut?: () => void }) {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingBottom: 14,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      }}
    >
      <Text style={[typography.h2, { marginTop: spacing.md }]}>{title}</Text>
      {onSignOut ? (
        <TouchableOpacity onPress={onSignOut} style={{ position: 'absolute', right: spacing.lg, top: spacing.md }}>
          <Text style={{ color: colors.danger, fontFamily: fontFamily.medium }}>Sair</Text>
        </TouchableOpacity>
      ) : null}
      <View
        style={{
          backgroundColor: colors.primary,
          flexDirection: 'row',
          paddingHorizontal: 24,
          paddingVertical: 4,
          gap: 5,
          borderRadius: 12,
          marginTop: 14,
          alignItems: 'center',
        }}
      >
        <Image source={require('../../assets/images/security.png')} />
        <Text style={{ color: colors.white, fontFamily: fontFamily.regular }}>Segurança da informação</Text>
      </View>
    </View>
  );
}
