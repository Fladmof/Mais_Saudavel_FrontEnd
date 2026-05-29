import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import InputField from './inputField';
import PasswordField from './passwordField';
import Pickery from '../picker';
import { useRouter } from 'expo-router';
import { register } from '../services/api';

const SignUpComponent = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!username || !password || !confirmPassword) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await register(username, password, 'utente');
      router.push('/ficha-medica');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao criar conta';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formCard}>
      <TouchableOpacity style={styles.switchButton} onPress={() => router.push('../(auth)/medico-signup')}>
        <Text style={styles.switchText}>Criar conta como médico</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Conta</Text>
      <InputField
        fieldName="Email"
        placeholder="seu@email.com"
        value={username}
        onChangeText={setUsername}
      />
      <PasswordField
        fieldName="Senha"
        placeholder="password"
        value={password}
        onChangeText={setPassword}
      />
      <PasswordField
        fieldName="Confirmar senha"
        placeholder="password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.sectionHeading}>Dados pessoais</Text>
      <View style={styles.rowGroup}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>Nome</Text>
          <TextInput placeholder='' style={styles.inlineInput} />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>Apelido</Text>
          <TextInput placeholder='' style={styles.inlineInput} />
        </View>
      </View>

      <View style={styles.rowGroup}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>Data de nascimento</Text>
          <TextInput placeholder='' style={styles.inlineInput} />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>Género</Text>
          <Pickery width={140} selectOptions={['Masculino', 'Feminino']} />
        </View>
      </View>

      <InputField fieldName={'Telefone'} placeholder={''} />
      <InputField fieldName={'BI/Passport'} placeholder={''} />
      <InputField fieldName={'Morada'} placeholder={''} />

      <Text style={styles.fieldLabel}>Profissão</Text>
      <Pickery width={300} selectOptions={['', 'Electricista', 'Professor', 'Outro']} />

      <Text style={styles.sectionHeading}>Dados Biológicos</Text>
      <View style={styles.rowGroup}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>Factor RH</Text>
          <TextInput placeholder='' style={styles.inlineInput} />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>Grupo sanguíneo</Text>
          <Pickery width={140} selectOptions={['O+', 'O-', 'Outro']} />
        </View>
      </View>

      <View style={styles.rowGroup}>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>Peso (kg)</Text>
          <TextInput placeholder='' style={styles.inlineInput} keyboardType='numeric' />
        </View>
        <View style={styles.halfField}>
          <Text style={styles.fieldLabel}>Altura (m)</Text>
          <TextInput placeholder='' style={styles.inlineInput} keyboardType='numeric' />
        </View>
      </View>

      <Text style={styles.sectionHeading}>Histórico Médico</Text>
      <Text style={styles.fieldLabel}>Alergia</Text>
      <Pickery width={300} selectOptions={['', 'Comida', 'Enlatado', 'Cosméticos', 'Medicamentos', 'Doces', 'Outro']} />
      <View style={styles.separator} />
      <Text style={styles.fieldLabel}>Condições especiais</Text>
      <Pickery width={300} selectOptions={['', 'Diabete', 'Alergia', 'Albinismo', 'Cadeirante', 'Cegueira', 'Tensão arterial']} />

      <Text style={styles.sectionHeading}>Contacto de emergência</Text>
      <InputField fieldName={'Nome do contacto'} placeholder={'nome'} />
      <InputField fieldName={'Relação'} placeholder={'irmão/amigo/familiar...'} />
      <InputField fieldName={'Telefone'} placeholder={'+244 ...'} />

      <TouchableOpacity style={[styles.submitBtn, loading && styles.disabledBtn]} onPress={handleRegister} disabled={loading}>
        <Text style={styles.submitText}>{loading ? 'Criando...' : 'Criar conta'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpComponent;

const styles = StyleSheet.create({
  formCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#1A2A3A',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  switchButton: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  switchText: {
    color: '#1CA625',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#1F2A37',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  sectionHeading: {
    color: '#5E6E7E',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#5E6E7E',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  halfField: {
    flex: 1,
  },
  inlineInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D8E1EA',
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    color: '#1F2A37',
    fontSize: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#EDF1F3',
    marginVertical: 18,
  },
  submitBtn: {
    backgroundColor: '#1CA625',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 22,
    alignItems: 'center',
  },
  submitText: {
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.65,
  },
  errorText: {
    color: '#D3382A',
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});
