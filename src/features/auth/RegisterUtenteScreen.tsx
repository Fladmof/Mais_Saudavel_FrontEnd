import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Screen } from '../../components/Screen';
import { Logo } from '../../components/Logo';
import { Section } from '../../components/Section';
import { TextField } from '../../components/TextField';
import { PasswordField } from '../../components/PasswordField';
import { SelectField } from '../../components/SelectField';
import { DateField } from '../../components/DateField';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme';

// Registo de utente (Figma 64:160): Conta, Dados pessoais, Dados Biologicos,
// Historico medico (com Detalhes) e Contacto de emergencia.

const GENEROS = ['Masculino', 'Feminino', 'Outro'];
const GRUPOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const FACTOR_RH = ['Positivo', 'Negativo'];

type Form = {
  email: string; password: string; confirmar: string;
  nome: string; apelido: string; genero: string; telefone: string; bi: string; morada: string; profissao: string;
  gsanguineo: string; factorrh: string; peso: string; altura: string;
  alergia: string; condespeciais: string; detalhes: string;
  contato_emergencia: string; relacao: string; telemergencia: string;
};

const VAZIO: Form = {
  email: '', password: '', confirmar: '',
  nome: '', apelido: '', genero: '', telefone: '', bi: '', morada: '', profissao: '',
  gsanguineo: '', factorrh: '', peso: '', altura: '',
  alergia: '', condespeciais: '', detalhes: '',
  contato_emergencia: '', relacao: '', telemergencia: '',
};

export function RegisterUtenteScreen() {
  const { registerUtente } = useAuth();
  const [form, setForm] = useState<Form>(VAZIO);
  const [nascimento, setNascimento] = useState<Date | null>(null);
  const [erros, setErros] = useState<Partial<Record<keyof Form | 'nascimento' | 'geral', string>>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validar = () => {
    const e: typeof erros = {};
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (form.password.length < 8) e.password = 'Mínimo 8 caracteres';
    if (form.confirmar !== form.password) e.confirmar = 'As senhas não coincidem';
    if (!form.nome.trim()) e.nome = 'Obrigatório';
    if (!nascimento) e.nascimento = 'Obrigatório';
    if (!form.genero) e.genero = 'Obrigatório';
    if (!form.telefone.trim()) e.telefone = 'Obrigatório';
    if (!form.bi.trim()) e.bi = 'Obrigatório';
    if (!form.morada.trim()) e.morada = 'Obrigatório';
    if (!form.gsanguineo) e.gsanguineo = 'Obrigatório';
    if (!form.factorrh) e.factorrh = 'Obrigatório';
    if (!form.peso || isNaN(parseFloat(form.peso))) e.peso = 'Número inválido';
    if (!form.altura || isNaN(parseFloat(form.altura))) e.altura = 'Número inválido';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validar()) return;
    setLoading(true);
    const r = await registerUtente({
      nome: `${form.nome.trim()} ${form.apelido.trim()}`.trim(),
      email: form.email.trim(),
      password: form.password,
      telefone: form.telefone.trim(),
      datanascimento: nascimento!.toISOString().slice(0, 10),
      genero: form.genero,
      bi: form.bi.trim(),
      morada: form.morada.trim(),
      profissao: form.profissao.trim() || undefined,
      gsanguineo: form.gsanguineo,
      factorrh: form.factorrh,
      peso: parseFloat(form.peso),
      altura: parseFloat(form.altura),
      alergia: form.alergia.trim() || undefined,
      condespeciais: form.condespeciais.trim() || undefined,
      detalhes: form.detalhes.trim() || undefined,
      contato_emergencia: form.contato_emergencia.trim() || undefined,
      relacao: form.relacao.trim() || undefined,
      telemergencia: form.telemergencia.trim() || undefined,
    });
    setLoading(false);
    if (!r.ok) setErros((e) => ({ ...e, geral: r.message || 'Falha no registo' }));
    // sucesso: auto-login e o guard encaminha
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginVertical: spacing.xl }}>
          <Logo />
        </View>
        <Text style={[typography.h2, { textAlign: 'center' }]}>Criar conta de utente</Text>

        <Section title="Conta">
          <TextField label="Email" value={form.email} onChangeText={set('email')} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" error={erros.email} />
          <PasswordField label="Senha" value={form.password} onChangeText={set('password')} placeholder="mínimo 8 caracteres" error={erros.password} />
          <PasswordField label="Confirmar senha" value={form.confirmar} onChangeText={set('confirmar')} placeholder="repita a senha" error={erros.confirmar} />
        </Section>

        <Section title="Dados pessoais">
          <TextField label="Nome" value={form.nome} onChangeText={set('nome')} placeholder="nome" error={erros.nome} />
          <TextField label="Apelido" value={form.apelido} onChangeText={set('apelido')} placeholder="apelido" />
          <DateField label="Data de nascimento" value={nascimento} onChange={setNascimento} placeholder="dd/mm/aaaa" error={erros.nascimento} />
          <SelectField label="Género" value={form.genero} onValueChange={set('genero')} options={GENEROS} error={erros.genero} />
          <TextField label="Telefone" value={form.telefone} onChangeText={set('telefone')} placeholder="9xx xxx xxx" keyboardType="phone-pad" error={erros.telefone} />
          <TextField label="BI/Passaporte" value={form.bi} onChangeText={set('bi')} placeholder="BI/Passport" autoCapitalize="characters" error={erros.bi} />
          <TextField label="Morada" value={form.morada} onChangeText={set('morada')} placeholder="Morada" error={erros.morada} />
          <TextField label="Profissão" value={form.profissao} onChangeText={set('profissao')} placeholder="ex.: Professor, Electricista" />
        </Section>

        <Section title="Dados Biológicos">
          <SelectField label="Grupo sanguíneo" value={form.gsanguineo} onValueChange={set('gsanguineo')} options={GRUPOS} error={erros.gsanguineo} />
          <SelectField label="Factor RH" value={form.factorrh} onValueChange={set('factorrh')} options={FACTOR_RH} error={erros.factorrh} />
          <TextField label="Peso (kg)" value={form.peso} onChangeText={set('peso')} placeholder="70" keyboardType="numeric" error={erros.peso} />
          <TextField label="Altura (m)" value={form.altura} onChangeText={set('altura')} placeholder="1.75" keyboardType="numeric" error={erros.altura} />
        </Section>

        <Section title="Histórico médico">
          <TextField label="Alergia" value={form.alergia} onChangeText={set('alergia')} placeholder="Comida, Medicamentos, Cosméticos…" />
          <TextField label="Condições especiais" value={form.condespeciais} onChangeText={set('condespeciais')} placeholder="Diabete, Tensão arterial…" />
          <TextField label="Detalhes" value={form.detalhes} onChangeText={set('detalhes')} placeholder="descreva detalhes relevantes" multiline />
        </Section>

        <Section title="Contacto de emergência">
          <TextField label="Nome do contacto" value={form.contato_emergencia} onChangeText={set('contato_emergencia')} placeholder="Nome do contacto" />
          <TextField label="Relação" value={form.relacao} onChangeText={set('relacao')} placeholder="irmão/amigo/familiar/…" />
          <TextField label="Telefone" value={form.telemergencia} onChangeText={set('telemergencia')} placeholder="9xx xxx xxx" keyboardType="phone-pad" />
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
