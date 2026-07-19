import React, { useEffect, useRef } from 'react';
import { Animated, Easing, DimensionValue } from 'react-native';
import { colors, radii, spacing } from '../theme';

type Props = {
  altura?: number;
  largura?: DimensionValue;
  radio?: keyof typeof radii;
};

// Carregamento com a forma do conteúdo, não um spinner centrado: em ligação
// instável o utente precisa de ver que ALGO está a chegar.
export function Skeleton({ altura = spacing.lg, largura = '100%', radio = 'sm' }: Props) {
  const pulso = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animacao = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulso, { toValue: 0.4, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    animacao.start();
    return () => animacao.stop();
  }, [pulso]);

  return (
    <Animated.View
      accessibilityLabel="A carregar"
      accessibilityRole="progressbar"
      style={{
        height: altura,
        width: largura,
        borderRadius: radii[radio],
        backgroundColor: colors.surfaceSunken,
        opacity: pulso,
      }}
    />
  );
}
