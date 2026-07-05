import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Logo } from '../../components/Logo';
import { TabSwitch } from '../../components/TabSwitch';
import { TextField } from '../../components/TextField';
import { PasswordField } from '../../components/PasswordField';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, fontFamily } from '../../theme';

// Ecra de Login do Figma (node 63:122): tabs Entrar/Criar conta.
// "Recuperar" liga ao fluxo real de recuperacao de senha; Google fica adiado.
export function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [tab, setTab] = useState<0 | 1>(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const brevemente = () =>
    Alert.alert('Disponível brevemente', 'Esta funcionalidade estará disponível numa próxima versão.');

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
      <ScrollView contentContainerStyle={{ padding: spacing.xl }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginVertical: spacing.xxl }}>
          <Logo />
        </View>

        <TabSwitch options={['Entrar', 'Criar conta']} value={tab} onChange={setTab} />

        {tab === 0 ? (
          <View style={{ marginTop: spacing.xl }}>
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="fortunatofortran@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <PasswordField label="Senha" value={password} onChangeText={setPassword} placeholder="•••••••" />

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg }}>
              <Text style={typography.body}>Esqueceu a senha? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/recuperar-senha')}>
                <Text style={[typography.body, { color: '#4D81E7' }]}>Recuperar</Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <Text style={{ color: colors.danger, marginTop: spacing.md, textAlign: 'center' }}>{error}</Text>
            ) : null}

            <View style={{ marginTop: spacing.xl }}>
              <Button title="Entrar" onPress={onSubmit} loading={loading} />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl }}>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
              <Text style={[typography.caption, { marginHorizontal: spacing.md }]}>Ou</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            </View>

            <TouchableOpacity
              onPress={brevemente}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingVertical: spacing.md,
                gap: spacing.sm,
              }}
            >
              <Image source={require('../../../assets/images/google.png')} style={{ width: 20, height: 20 }} resizeMode="contain" />
              <Text style={{ fontFamily: fontFamily.medium, fontSize: 15, color: colors.textMuted }}>Entrar com Google</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginTop: spacing.xl }}>
            <Text style={[typography.body, { textAlign: 'center', color: colors.textSubtle, marginBottom: spacing.xl }]}>
              Escolha o tipo de conta que quer criar
            </Text>
            <Button title="Criar conta de utente" onPress={() => router.push('/(auth)/register-utente')} />
            <View style={{ marginTop: spacing.lg }}>
              <Button title="Criar conta de médico" variant="ghost" onPress={() => router.push('/(auth)/register-medico')} />
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
