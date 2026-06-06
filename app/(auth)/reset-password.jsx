import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import apiConfig from '../../config/api';
import api from '../../services/apiService';
import { useRouter, useSearchParams } from 'expo-router';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [sending, setSending] = useState(false);

  const handleReset = async () => {
    if (!password) return Alert.alert('Erro', 'Informe a nova senha');
    if (password !== confirm) return Alert.alert('Erro', 'As senhas não coincidem');
    setSending(true);
    try {
      await api.post(apiConfig.endpoints.auth.resetPassword, { token, password });
      Alert.alert('Sucesso', 'Senha redefinida. Faça login.');
      router.replace('/(auth)/sign-in');
    } catch (err) {
      console.error('Reset password error', err);
      Alert.alert('Erro', err?.response?.data?.message || 'Não foi possível redefinir a senha');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir senha</Text>
      <TextInput value={password} onChangeText={setPassword} placeholder="Nova senha" secureTextEntry style={styles.input} />
      <TextInput value={confirm} onChangeText={setConfirm} placeholder="Confirmar senha" secureTextEntry style={styles.input} />
      <TouchableOpacity style={[styles.button, sending && styles.buttonDisabled]} onPress={handleReset} disabled={sending}>
        {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Redefinir</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginBottom: 12 },
  button: { backgroundColor: '#2b9128', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
