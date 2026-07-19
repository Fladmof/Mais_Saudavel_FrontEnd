import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  bold: 'SpaceGrotesk_700Bold',
} as const;

// 6 níveis. A cor NÃO faz parte da escala: acoplá-la foi o que espalhou
// `textMuted` (2.08:1) por toda a app. Cor é decisão do local de uso.
export const typography: Record<
  'display' | 'h1' | 'h2' | 'title' | 'body' | 'caption',
  TextStyle
> = {
  display: { fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40 }, // 1.25
  h1: { fontFamily: fontFamily.bold, fontSize: 24, lineHeight: 32 }, //      1.33
  h2: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 28 }, //      1.40
  title: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 24 }, // 1.50
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 }, // 1.50
  caption: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 }, // 1.43
};
