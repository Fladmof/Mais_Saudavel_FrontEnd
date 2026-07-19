import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { spacing } from '../theme';

type Props = {
  onPress: () => void;
  /** Obrigatório: descreve a AÇÃO, não o aspeto. Ex.: "Marcar consulta". */
  accessibilityLabel: string;
  accessibilityRole?: 'button' | 'link' | 'tab' | 'checkbox' | 'radio';
  accessibilityHint?: string;
  disabled?: boolean;
  busy?: boolean;
  selected?: boolean;
  /** Aplica o alvo mínimo de 48 dp. Só desligar dentro de um alvo maior. */
  alvoMinimo?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

// Primitivo tocável da app. `accessibilityLabel` é obrigatório por tipo:
// um tocável inacessível não compila.
export function Touchable({
  onPress,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityHint,
  disabled = false,
  busy = false,
  selected,
  alvoMinimo = true,
  style,
  children,
}: Props) {
  const inativo = disabled || busy;

  return (
    <Pressable
      onPress={inativo ? undefined : onPress}
      disabled={inativo}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inativo, busy, selected }}
      // hitSlop só se aplica quando alvoMinimo está desligado: alvos que já
      // cumprem os 48 dp não precisam dele, e aplicá-lo sempre sobrepunha a
      // separação mínima de 8 dp entre dois alvos vizinhos.
      hitSlop={
        alvoMinimo
          ? undefined
          : { top: spacing.sm, bottom: spacing.sm, left: spacing.sm, right: spacing.sm }
      }
      style={({ pressed }) => [
        alvoMinimo
          ? { minHeight: spacing.touchMin, minWidth: spacing.touchMin, justifyContent: 'center' }
          : null,
        { opacity: pressed && !inativo ? 0.85 : 1 },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}
