import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../components/inputField';
import PasswordField from '../components/passwordField';
import { AuthContext } from '../context/AuthContext';

export default function SignIn() {
  const router = useRouter();
  const { loading, error, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const redirectByRole = (role) => {
    if (role === 'admin') return router.replace('/admin-dashboard');
    if (role === 'medico') return router.replace('/(medicoTabs)/home');
    return router.replace('/(tabs)/ficha-medica');
  };

  const [submitting, setSubmitting] = useState(false);

const handleSubmit = async () => {
  if (loading || submitting) return;
  setSubmitting(true);

  try {
    console.log('[SignIn] submit', { email });
    const result = await login(email.trim(), password);
    console.log('[SignIn] login result', result);

    if (result && result.success && result.user) {
      redirectByRole(result.user.role);
    } else {
      Alert.alert('Erro', result?.error?.message || 'Credenciais inválidas');
    }
  } catch (err) {
    console.error('[SignIn] error', err);
    Alert.alert('Erro', 'Ocorreu um erro inesperado');
  } finally {
    setSubmitting(false);
  }
};

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{String(error)}</Text>
        </View>
      )}

      <Text style={styles.title}>Entrar</Text>
      <InputField fieldName="Email" placeholder="seu@email.com" value={email} setValue={setEmail}/>
      <PasswordField
        fieldName="Senha"
        placeholder="password"
        value={password}
        setValue={setPassword}
        securityTextEntry={showPass}
        onToggleSecure={() => setShowPass(!showPass)}
      />

    <TouchableOpacity
      style={[styles.button, (loading || submitting) && styles.buttonDisabled]}
      onPress={handleSubmit}
      disabled={loading || submitting}
    >
  {loading || submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
    </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
        <Text style={styles.signupLink}>Não tem conta? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  errorBox: { backgroundColor: '#ffebee', borderLeftWidth: 4, borderLeftColor: '#d32f2f', padding: 12, marginBottom: 15, borderRadius: 4 },
  errorText: { color: '#d32f2f' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2b9128' },
  button: { backgroundColor: '#2b9128', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  signupLink: { color: '#2b9128', textAlign: 'center', marginTop: 15, fontWeight: '500' }
});