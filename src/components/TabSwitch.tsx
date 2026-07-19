import React from 'react';
import { View, Text } from 'react-native';
import { Touchable } from './Touchable';
import { colors, spacing, radii, typography } from '../theme';

type Props = { options: [string, string]; value: 0 | 1; onChange: (i: 0 | 1) => void };

// Comutador Entrar/Criar conta do ecra de Login (Figma 63:122)
export function TabSwitch({ options, value, onChange }: Props) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.surfaceSunken, borderRadius: radii.md, padding: spacing.xs }}>
      {options.map((label, i) => {
        const ativo = value === i;
        return (
          <Touchable
            key={label}
            onPress={() => onChange(i as 0 | 1)}
            accessibilityRole="tab"
            accessibilityLabel={label}
            selected={ativo}
            style={{
              flex: 1,
              paddingVertical: spacing.md,
              borderRadius: radii.sm,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: ativo ? colors.surface : 'transparent',
            }}
          >
            <Text style={[typography.title, { color: ativo ? colors.actionInk : colors.inkSecondary }]}>
              {label}
            </Text>
          </Touchable>
        );
      })}
    </View>
  );
}
