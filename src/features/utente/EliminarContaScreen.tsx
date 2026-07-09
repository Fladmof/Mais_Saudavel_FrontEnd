import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PasswordField } from '../../components/PasswordField';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme';

// Eliminacao parcial de conta: os dados clinicos ficam preservados no sistema
// (obrigacoes clinicas/legais) mas o acesso e desativado de imediato.

export function EliminarContaScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [aEliminar, setAEliminar] = useState(false);

  const confirmar = () => {
    if (!password) {
      Alert.alert('Senha necessária', 'Confirme a eliminação com a sua senha.');
      return;
    }
    Alert.alert(
      'Eliminar conta',
      'O acesso à sua conta será desativado de imediato. Os seus dados clínicos ficam preservados. Para reativar terá de contactar o suporte. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar conta',
          style: 'destructive',
          onPress: async () => {
            setAEliminar(true);
            const r = await authService.partialDelete(password);
            setAEliminar(false);
            if (r.ok) {
              Alert.alert('Conta desativada', r.message, [{ text: 'OK', onPress: () => signOut() }]);
            } else {
              Alert.alert('Erro', r.message || 'Não foi possível eliminar a conta');
            }
          },
        },
      ]
    );
  };

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <PageHeader title="Eliminar Conta" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          <Card style={{ marginTop: spacing.xl }}>
            <Text style={{ color: colors.danger, fontSize: 15, marginBottom: spacing.sm }}>
              Esta ação desativa o acesso à sua conta.
            </Text>
            <Text style={typography.caption}>
              • O login deixa de funcionar de imediato.{'\n'}
              • Os seus dados clínicos (ficha, consultas, medicação) ficam preservados.{'\n'}
              • Para reativar a conta terá de contactar o suporte.
            </Text>
          </Card>

          <PasswordField label="Confirme com a sua senha" value={password} onChangeText={setPassword} />

          <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
            <Button title="Eliminar a minha conta" variant="outline" onPress={confirmar} loading={aEliminar} />
            <Button title="Cancelar" variant="ghost" onPress={() => router.back()} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
