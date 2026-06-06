import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import apiConfig from '../../config/api';
import api from '../../services/apiService';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Informe um email válido');
      return;
    }
    setSending(true);
    try {
      await api.post(apiConfig.endpoints.auth.forgotPassword, { email: email.trim() });
      Alert.alert('Enviado', 'Se o email existir, enviámos instruções para redefinir a senha.');
      router.push('/(auth)/sign-in');
    } catch (err) {
      console.error('Forgot password error', err);
      Alert.alert('Erro', 'Não foi possível enviar o email. Tente novamente mais tarde.');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar senha</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="seu@email.com" style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TouchableOpacity style={[styles.button, sending && styles.buttonDisabled]} onPress={handleSend} disabled={sending}>
        {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enviar</Text>}
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
