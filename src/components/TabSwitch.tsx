import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, spacing, fontFamily } from '../theme';

type Props = { options: [string, string]; value: 0 | 1; onChange: (i: 0 | 1) => void };

// Comutador Entrar/Criar conta do ecra de Login (Figma 63:122)
export function TabSwitch({ options, value, onChange }: Props) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#F5F6F8', borderRadius: 12, padding: spacing.xs }}>
      {options.map((label, i) => {
        const ativo = value === i;
        return (
          <TouchableOpacity
            key={label}
            onPress={() => onChange(i as 0 | 1)}
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              borderRadius: 10,
              alignItems: 'center',
              backgroundColor: ativo ? colors.white : 'transparent',
            }}
          >
            <Text style={{ fontFamily: fontFamily.medium, fontSize: 15, color: ativo ? colors.primary : colors.textMuted }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
