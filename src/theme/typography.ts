import { TextStyle } from 'react-native';
import { colors } from './colors';

export const fontFamily = {
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  bold: 'SpaceGrotesk_700Bold',
} as const;

export const typography: Record<'h1' | 'h2' | 'title' | 'body' | 'caption', TextStyle> = {
  h1: { fontFamily: fontFamily.bold, fontSize: 34, color: colors.primary },
  h2: { fontFamily: fontFamily.bold, fontSize: 22, color: colors.primary },
  title: { fontFamily: fontFamily.medium, fontSize: 16, color: colors.black },
  body: { fontFamily: fontFamily.regular, fontSize: 15, color: colors.black },
  caption: { fontFamily: fontFamily.regular, fontSize: 12, color: colors.textMuted },
};
