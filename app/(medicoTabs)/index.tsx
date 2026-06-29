import { View, Text } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Button } from '../../src/components/Button';
import { useAuth } from '../../src/context/AuthContext';
import { typography, spacing } from '../../src/theme';

export default function MedicoHome() {
  const { user, signOut } = useAuth();
  return (
    <Screen>
      <View style={{ flex: 1, padding: spacing.xl, justifyContent: 'center' }}>
        <Text style={typography.h2}>Dr(a). {user?.nome}</Text>
        <Text style={[typography.body, { marginVertical: spacing.md }]}>Área do médico (em construção)</Text>
        <Button title="Sair" variant="outline" onPress={signOut} />
      </View>
    </Screen>
  );
}
