import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { Logo } from '../../src/components/Logo';
import { TextField } from '../../src/components/TextField';
import { PasswordField } from '../../src/components/PasswordField';
import { Button } from '../../src/components/Button';
import { useAuth } from '../../src/context/AuthContext';
import { colors, spacing, typography } from '../../src/theme';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Preencha email e senha');
      return;
    }
    setLoading(true);
    const r = await signIn(email.trim(), password);
    setLoading(false);
    if (!r.ok) setError(r.message || 'Falha no login');
    // sucesso: o guard da raiz encaminha automaticamente
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, alignItems: 'center' }}>
        <View style={{ marginVertical: spacing.xxl }}>
          <Logo />
        </View>
        <Text style={[typography.h2, { marginBottom: spacing.xl }]}>Entrar</Text>
        <View style={{ width: '100%' }}>
          <TextField label="Email" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
          <PasswordField label="Senha" value={password} onChangeText={setPassword} placeholder="palavra-passe" />
          {error ? <Text style={{ color: colors.danger, marginTop: spacing.md }}>{error}</Text> : null}
          <View style={{ marginTop: spacing.xl }}>
            <Button title="Entrar" onPress={onSubmit} loading={loading} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
