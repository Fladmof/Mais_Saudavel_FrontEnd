import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Logo } from '../../components/Logo';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { authService } from '../../services/authService';
import { colors, spacing, typography } from '../../theme';

// Recuperar senha (passo 1): pede o email e envia um codigo de 6 digitos.
// Sem ecra no Figma -> desenhado no design system, coerente com o Login.
export function RecuperarSenhaScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError('');
    if (!email.trim()) {
      setError('Informe o seu email');
      return;
    }
    setLoading(true);
    const r = await authService.forgotPassword(email.trim());
    setLoading(false);
    if (!r.ok) {
      setError(r.message || 'Não foi possível enviar o código');
      return;
    }
    router.push({
      pathname: '/(auth)/redefinir-senha',
      params: { email: email.trim(), ...(r.devCode ? { devCode: r.devCode } : {}) },
    });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginVertical: spacing.xxl }}>
          <Logo />
        </View>

        <Text style={[typography.title, { fontSize: 22, textAlign: 'center' }]}>Recuperar senha</Text>
        <Text
          style={[
            typography.body,
            { textAlign: 'center', color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.xl },
          ]}
        >
          Indique o email da sua conta. Enviaremos um código de 6 dígitos para redefinir a senha.
        </Text>

        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {error ? (
          <Text style={{ color: colors.danger, marginTop: spacing.md, textAlign: 'center' }}>{error}</Text>
        ) : null}

        <View style={{ marginTop: spacing.xl }}>
          <Button title="Enviar código" onPress={onSubmit} loading={loading} />
        </View>

        <View style={{ alignItems: 'center', marginTop: spacing.lg }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[typography.body, { color: colors.primary }]}>Voltar ao início de sessão</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
