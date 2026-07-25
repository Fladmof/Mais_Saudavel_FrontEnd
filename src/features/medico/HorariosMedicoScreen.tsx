import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Switch, TextInput, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ServerError } from '../../components/ServerError';
import { medicoService } from '../../services/medicoService';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, fontFamily, radii } from '../../theme';

// Ecra do medico para preencher a disponibilidade semanal: uma janela por dia
// (hora inicio/fim, slots de 30 min). Os utentes so conseguem agendar dentro
// destas janelas.

type Dia = { ativo: boolean; inicio: string; fim: string };

// Ordem de apresentacao: segunda (1) a domingo (0)
const ORDEM_DIAS = [1, 2, 3, 4, 5, 6, 0];
const NOME_DIA: Record<number, string> = {
  0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado',
};

const DIA_VAZIO: Dia = { ativo: false, inicio: '08:00', fim: '16:00' };

export function horaValida(v: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
}

export function HorariosMedicoScreen() {
  const { user } = useAuth();
  const medicoId = user?.medico?.id;
  const [dias, setDias] = useState<Record<number, Dia>>(
    Object.fromEntries(ORDEM_DIAS.map((d) => [d, { ...DIA_VAZIO }]))
  );
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);

  const carregar = useCallback(async () => {
    if (!medicoId) return;
    const r = await medicoService.horariosDoMedico(medicoId);
    setLoading(false);
    setNetworkError(!!r.network);
    if (r.ok && r.data) {
      const novos: Record<number, Dia> = Object.fromEntries(ORDEM_DIAS.map((d) => [d, { ...DIA_VAZIO }]));
      for (const h of r.data.horarios) {
        novos[h.dia_semana] = {
          ativo: h.ativo,
          inicio: String(h.hora_inicio).slice(0, 5),
          fim: String(h.hora_fim).slice(0, 5),
        };
      }
      setDias(novos);
    }
  }, [medicoId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const guardar = async () => {
    const janelas = [];
    for (const d of ORDEM_DIAS) {
      const dia = dias[d];
      if (!dia.ativo) continue;
      if (!horaValida(dia.inicio) || !horaValida(dia.fim)) {
        Alert.alert('Horário inválido', `${NOME_DIA[d]}: use o formato HH:MM (ex.: 08:00)`);
        return;
      }
      if (dia.inicio >= dia.fim) {
        Alert.alert('Horário inválido', `${NOME_DIA[d]}: a hora de início deve ser antes da hora de fim`);
        return;
      }
      janelas.push({ dia_semana: d, hora_inicio: dia.inicio, hora_fim: dia.fim, intervalo_minutos: 30 });
    }
    setAGuardar(true);
    const r = await medicoService.guardarSemana(janelas);
    setAGuardar(false);
    if (r.ok) Alert.alert('Guardado', 'A sua disponibilidade foi atualizada.');
    else Alert.alert('Erro', r.message || 'Não foi possível guardar');
  };

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  const atualizar = (d: number, campos: Partial<Dia>) => setDias({ ...dias, [d]: { ...dias[d], ...campos } });

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <PageHeader title="Disponibilidade" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          <Text style={[typography.caption, { marginTop: spacing.lg }]}>
            Defina as janelas em que aceita consultas. Os utentes só conseguem marcar dentro destes horários
            (consultas de 30 minutos).
          </Text>

          <View style={{ marginTop: spacing.lg }}>
            {ORDEM_DIAS.map((d) => {
              const dia = dias[d];
              return (
                <Card key={d} style={{ marginBottom: spacing.md }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...typography.title, color: colors.ink }}>{NOME_DIA[d]}</Text>
                    <Switch
                      value={dia.ativo}
                      onValueChange={(v) => atualizar(d, { ativo: v })}
                      trackColor={{ true: colors.action, false: colors.border }}
                      thumbColor={colors.surface}
                    />
                  </View>
                  {dia.ativo ? (
                    <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, alignItems: 'center' }}>
                      <Text style={{ ...typography.caption, color: colors.inkSecondary }}>Das</Text>
                      <TextInput
                        value={dia.inicio}
                        onChangeText={(v) => atualizar(d, { inicio: v })}
                        placeholder="08:00"
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                        style={{
                          borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm,
                          paddingVertical: spacing.sm, paddingHorizontal: spacing.md, minWidth: 80, textAlign: 'center',
                          fontFamily: fontFamily.medium,
                        }}
                      />
                      <Text style={{ ...typography.caption, color: colors.inkSecondary }}>às</Text>
                      <TextInput
                        value={dia.fim}
                        onChangeText={(v) => atualizar(d, { fim: v })}
                        placeholder="16:00"
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                        style={{
                          borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm,
                          paddingVertical: spacing.sm, paddingHorizontal: spacing.md, minWidth: 80, textAlign: 'center',
                          fontFamily: fontFamily.medium,
                        }}
                      />
                    </View>
                  ) : null}
                </Card>
              );
            })}
          </View>

          <Button title="Guardar disponibilidade" onPress={guardar} loading={aGuardar} />
        </View>
      </ScrollView>
    </Screen>
  );
}
