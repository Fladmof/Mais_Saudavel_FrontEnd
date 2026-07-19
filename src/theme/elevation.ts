import { ViewStyle } from 'react-native';
import { colors } from './colors';

// Sombras em RN no Android de gama baixa forçam repintura e custam frames em
// listas com scroll. A separação de superfícies faz-se com background vs
// surface + borda; `raised` fica só para o que flutua mesmo (modais, barras fixas).
export const elevation: Record<'none' | 'card' | 'raised', ViewStyle> = {
  none: {},
  card: { borderWidth: 1, borderColor: colors.border },
  raised: {
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
};
