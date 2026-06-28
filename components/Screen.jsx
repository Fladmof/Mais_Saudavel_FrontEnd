import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Envolve um ecrã respeitando as áreas seguras do telemóvel
 * (notch em cima, barra de navegação/gestos em baixo), para que
 * os botões nunca fiquem cobertos pelos botões do sistema.
 *
 * Uso: <Screen><...conteúdo...></Screen>
 * Em ecrãs dentro de <Tabs> a barra já trata do fundo — usar edges={['top']}.
 */
const Screen = ({ children, edges = ["top", "bottom"], style }) => (
  <SafeAreaView
    edges={edges}
    style={[{ flex: 1, backgroundColor: "#FFFFFF" }, style]}
  >
    {children}
  </SafeAreaView>
);

export default Screen;
