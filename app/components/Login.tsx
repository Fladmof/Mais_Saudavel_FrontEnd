import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import InputField from './inputField';
import { useRouter } from 'expo-router';
import { login as loginUser } from '../services/api';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!username || !password) {
      setError('Preencha o email e a senha.');
      return;
    }

    setLoading(true);
    try {
      await loginUser(username, password);
      router.push('/ficha-medica');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao conectar com o servidor';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <InputField
        fieldName="Email"
        placeholder="seu@email.com"
        value={username}
        onChangeText={setUsername}
      />

      <InputField
        fieldName="Senha"
        placeholder="palavra-passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.noCountText}>
        Não tem conta? <Text style={styles.linkText}>criar</Text>
      </Text>

      <TouchableOpacity
        style={[styles.loginBtn, loading && styles.disabledBtn]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.loginText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.googleBtn} onPress={() => router.push('/transitionPage')}>
        <Image style={styles.googleIcon} source={require('../../assets/images/google.png')} />
        <Text style={styles.googleText}>Entrar com Google</Text>
      </TouchableOpacity>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  loginBtn: {
    backgroundColor: '#1CA625',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#1CA625',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.65,
  },
  googleBtn: {
    flexDirection: 'row',
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#D8E1EA',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  googleText: {
    color: '#5E6E7E',
    fontWeight: '600',
  },
  noCountText: {
    color: '#5E6E7E',
    fontWeight: '500',
    marginTop: 16,
    textAlign: 'center',
  },
  linkText: {
    color: '#1CA625',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#EDF1F3',
    marginTop: 24,
    marginBottom: 18,
  },
  errorText: {
    color: '#D3382A',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});
