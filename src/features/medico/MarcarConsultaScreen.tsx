import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { DateField } from '../../components/DateField';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { utenteService } from '../../services/utenteService';
import { consultaService } from '../../services/consultaService';
import { UtentePerfil } from '../../api/types';
import { colors, spacing, typography } from '../../theme';

// Ecra novo (sem referencia Figma, autorizado): o medico marca uma consulta
// com o paciente — data, hora e notas.

export function juntarDataHora(data: Date, hora: Date): Date {
  const d = new Date(data);
  d.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
  return d;
}

export function MarcarConsultaScreen() {
  const router = useRouter();
  const { utenteId } = useLocalSearchParams<{ utenteId: string }>();
  const [paciente, setPaciente] = useState<UtentePerfil | null>(null);
  const [data, setData] = useState<Date | null>(null);
  const [hora, setHora] = useState<Date | null>(null);
  const [notas, setNotas] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const carregar = useCallback(async () => {
    if (!utenteId) return;
    const r = await utenteService.obterUtente(utenteId);
    if (r.ok && r.data?.utente) setPaciente(r.data.utente);
  }, [utenteId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const onSubmit = async () => {
    setErro('');
    if (!data || !hora) {
      setErro('Escolha a data e a hora da consulta');
      return;
    }
    const dataHora = juntarDataHora(data, hora);
    if (dataHora.getTime() <= Date.now()) {
      setErro('A consulta tem de ser no futuro');
      return;
    }
    setLoading(true);
    const r = await consultaService.marcarConsulta({
      utente_id: Number(utenteId),
      data_hora: dataHora.toISOString(),
      notas: notas.trim() || undefined,
    });
    setLoading(false);
    if (r.ok) {
      Alert.alert('Consulta marcada', `Consulta com ${paciente?.user?.nome ?? 'o paciente'} marcada com sucesso.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      setErro(r.message || 'Não foi possível marcar a consulta');
    }
  };

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.lg, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: spacing.md }}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={typography.h2}>Marcar consulta</Text>
        </View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xl }}>
            <Avatar nome={paciente?.user?.nome} size={48} />
            <View>
              <Text style={typography.title}>{paciente?.user?.nome ?? 'A carregar…'}</Text>
              <Text style={typography.caption}>Nº de utente: UT-{String(paciente?.id ?? 0).padStart(7, '0')}</Text>
            </View>
          </Card>

          <Card style={{ marginTop: spacing.lg }}>
            <DateField label="Data" value={data} onChange={setData} placeholder="dd/mm/aaaa" mode="date" />
            <DateField label="Hora" value={hora} onChange={setHora} placeholder="hh:mm" mode="time" />
            <TextField label="Notas (opcional)" value={notas} onChangeText={setNotas} placeholder="motivo da consulta, indicações…" multiline />
            {erro ? <Text style={{ color: colors.danger, marginTop: spacing.md, textAlign: 'center' }}>{erro}</Text> : null}
            <View style={{ marginTop: spacing.lg }}>
              <Button title="Marcar consulta" onPress={onSubmit} loading={loading} />
            </View>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
