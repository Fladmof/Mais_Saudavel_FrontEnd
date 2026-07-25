import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Logo } from '../../components/Logo';
import { Section } from '../../components/Section';
import { TextField } from '../../components/TextField';
import { PasswordField } from '../../components/PasswordField';
import { Button } from '../../components/Button';
import { Touchable } from '../../components/Touchable';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme';

// Registo de medico (Figma 320:926): Conta, Dados pessoais (com Telefone),
// Dados Profissionais; link "Criar conta como paciente".

type Form = {
  email: string; password: string; confirmar: string;
  nome: string; apelido: string; telefone: string;
  especialidade: string; hospital: string; crm: string;
};

const VAZIO: Form = {
  email: '', password: '', confirmar: '',
  nome: '', apelido: '', telefone: '',
  especialidade: '', hospital: '', crm: '',
};

export function RegisterMedicoScreen() {
  const router = useRouter();
  const { registerMedico } = useAuth();
  const [form, setForm] = useState<Form>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<keyof Form | 'geral', string>>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validar = () => {
    const e: typeof erros = {};
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (form.confirmar !== form.password) e.confirmar = 'As senhas não coincidem';
    if (!form.nome.trim()) e.nome = 'Obrigatório';
    if (!form.telefone.trim()) e.telefone = 'Obrigatório';
    if (!form.especialidade.trim()) e.especialidade = 'Obrigatório';
    if (!form.hospital.trim()) e.hospital = 'Obrigatório';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validar()) return;
    setLoading(true);
    const r = await registerMedico({
      nome: `${form.nome.trim()} ${form.apelido.trim()}`.trim(),
      email: form.email.trim(),
      password: form.password,
      telefone: form.telefone.trim(),
      especialidade: form.especialidade.trim(),
      hospital: form.hospital.trim(),
      crm: form.crm.trim() || undefined,
    });
    setLoading(false);
    if (!r.ok) setErros((e) => ({ ...e, geral: r.message || 'Falha no registo' }));
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginVertical: spacing.xl }}>
          <Logo />
        </View>
        <Text style={[typography.h2, { textAlign: 'center' }]}>Criar conta de médico</Text>
        <Touchable
          onPress={() => router.replace('/(auth)/register-utente')}
          accessibilityLabel="Criar conta como paciente"
          style={{ alignItems: 'center', marginTop: spacing.sm }}
        >
          <Text style={[typography.body, { color: colors.info }]}>Criar conta como paciente</Text>
        </Touchable>

        <Section title="Conta">
          <TextField label="Email" value={form.email} onChangeText={set('email')} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" error={erros.email} />
          <PasswordField label="Senha" value={form.password} onChangeText={set('password')} placeholder="mínimo 8 caracteres" error={erros.password} />
          <PasswordField label="Confirmar senha" value={form.confirmar} onChangeText={set('confirmar')} placeholder="repita a senha" error={erros.confirmar} />
        </Section>

        <Section title="Dados pessoais">
          <TextField label="Nome" value={form.nome} onChangeText={set('nome')} placeholder="nome" error={erros.nome} />
          <TextField label="Apelido" value={form.apelido} onChangeText={set('apelido')} placeholder="apelido" />
          <TextField label="Telefone" value={form.telefone} onChangeText={set('telefone')} placeholder="9xx xxx xxx" keyboardType="phone-pad" error={erros.telefone} />
        </Section>

        <Section title="Dados Profissionais">
          <TextField label="Especialidade" value={form.especialidade} onChangeText={set('especialidade')} placeholder="ex.: Cardiologia" error={erros.especialidade} />
          <TextField label="Hospital" value={form.hospital} onChangeText={set('hospital')} placeholder="ex.: Hospital Girassol" error={erros.hospital} />
          <TextField label="Nº de ordem (CRM)" value={form.crm} onChangeText={set('crm')} placeholder="opcional" autoCapitalize="characters" />
        </Section>

        {erros.geral ? (
          <Text style={{ color: colors.danger, textAlign: 'center', marginTop: spacing.lg }}>{erros.geral}</Text>
        ) : null}

        <View style={{ marginVertical: spacing.xl }}>
          <Button title="Criar conta" onPress={onSubmit} loading={loading} />
        </View>
      </ScrollView>
    </Screen>
  );
}
