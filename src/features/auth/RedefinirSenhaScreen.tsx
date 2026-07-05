import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Logo } from '../../components/Logo';
import { TextField } from '../../components/TextField';
import { PasswordField } from '../../components/PasswordField';
import { Button } from '../../components/Button';
import { authService } from '../../services/authService';
import { colors, spacing, typography } from '../../theme';

// Redefinir senha (passo 2): recebe o email por parametro, o codigo de 6 digitos
// e a nova senha. Em dev o codigo chega pre-preenchido (devCode) para testar.
export function RedefinirSenhaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; devCode?: string }>();
  const email = typeof params.email === 'string' ? params.email : '';
  const devCode = typeof params.devCode === 'string' ? params.devCode : '';

  const [code, setCode] = useState(devCode);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError('');
    if (!/^\d{6}$/.test(code.trim())) {
      setError('O código tem 6 dígitos');
      return;
    }
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem');
      return;
    }
    setLoading(true);
    const r = await authService.resetPassword(email, code.trim(), password);
    setLoading(false);
    if (!r.ok) {
      setError(r.message || 'Não foi possível redefinir a senha');
      return;
    }
    Alert.alert('Senha redefinida', r.message || 'Já pode entrar com a nova senha.');
    router.replace('/(auth)/login');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginVertical: spacing.xxl }}>
          <Logo />
        </View>

        <Text style={[typography.title, { fontSize: 22, textAlign: 'center' }]}>Redefinir senha</Text>
        <Text
          style={[
            typography.body,
            { textAlign: 'center', color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.xl },
          ]}
        >
          {email
            ? `Introduza o código enviado para ${email} e a nova senha.`
            : 'Introduza o código recebido e a nova senha.'}
        </Text>

        {devCode ? (
          <Text style={{ textAlign: 'center', color: colors.primary, marginBottom: spacing.md }}>
            Código de teste (modo dev): {devCode}
          </Text>
        ) : null}

        <TextField label="Código" value={code} onChangeText={setCode} placeholder="000000" keyboardType="number-pad" />
        <PasswordField label="Nova senha" value={password} onChangeText={setPassword} placeholder="•••••••" />
        <PasswordField label="Confirmar senha" value={confirm} onChangeText={setConfirm} placeholder="•••••••" />

        {error ? (
          <Text style={{ color: colors.danger, marginTop: spacing.md, textAlign: 'center' }}>{error}</Text>
        ) : null}

        <View style={{ marginTop: spacing.xl }}>
          <Button title="Redefinir senha" onPress={onSubmit} loading={loading} />
        </View>

        <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={[typography.body, { color: colors.primary }]}>Voltar ao início de sessão</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
