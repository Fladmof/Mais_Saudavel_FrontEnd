import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '../theme';

type Props = {
  children: React.ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, edges = ['top', 'bottom'], style }: Props) {
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: colors.background }, style]}>
      {children}
    </SafeAreaView>
  );
}
