import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ServerError } from '../../components/ServerError';
import { consultaService } from '../../services/consultaService';
import { Consulta, EstadoConsulta } from '../../api/types';
import { colors, spacing, typography, fontFamily } from '../../theme';

// Aba "Consultas" do utente: lista as consultas com estado e permite marcar
// nova consulta (fluxo /agendar), entrar na teleconsulta ou cancelar.

const ESTADO_LABEL: Record<EstadoConsulta, string> = {
  agendada: 'Agendada',
  em_curso: 'Em curso',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
};

const ESTADO_COR: Record<EstadoConsulta, string> = {
  agendada: colors.primary,
  em_curso: colors.action,
  concluida: colors.textSubtle,
  cancelada: colors.danger,
};

function ConsultaCard({ consulta, onEntrar, onCancelar }: { consulta: Consulta; onEntrar: () => void; onCancelar: () => void }) {
  const quando = new Date(consulta.data_hora).toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' });
  return (
    <Card style={{ marginBottom: spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fontFamily.medium, fontSize: 15 }}>
            Dr(a). {consulta.medico?.user?.nome ?? '—'}
          </Text>
          <Text style={typography.caption}>{consulta.medico?.especialidade ?? ''}</Text>
          <Text style={[typography.caption, { marginTop: 2 }]}>{quando}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: spacing.sm }}>
          <View style={{ backgroundColor: colors.tagBg, paddingVertical: 4, paddingHorizontal: 12, borderRadius: 14 }}>
            <Text style={{ color: ESTADO_COR[consulta.estado], fontFamily: fontFamily.medium, fontSize: 12 }}>
              {ESTADO_LABEL[consulta.estado]}
            </Text>
          </View>
          {consulta.estado === 'em_curso' ? (
            <TouchableOpacity onPress={onEntrar}>
              <View style={{ backgroundColor: colors.action, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 16 }}>
                <Text style={{ color: colors.white, fontFamily: fontFamily.medium, fontSize: 13 }}>Entrar</Text>
              </View>
            </TouchableOpacity>
          ) : null}
          {consulta.estado === 'agendada' ? (
            <TouchableOpacity onPress={onCancelar}>
              <Text style={{ color: colors.danger, fontSize: 12, fontFamily: fontFamily.medium }}>Cancelar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

export function ConsultasScreen() {
  const router = useRouter();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    const r = await consultaService.minhasConsultas();
    setLoading(false);
    setNetworkError(!!r.network);
    if (r.ok && r.data) {
      // Mais recentes/próximas primeiro
      const ordenadas = [...r.data.consultas].sort(
        (a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime()
      );
      setConsultas(ordenadas);
      setErro('');
    } else if (!r.network) {
      setErro(r.message || 'Falha ao carregar as consultas');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const cancelar = (consulta: Consulta) =>
    Alert.alert('Cancelar consulta', 'Tem a certeza que quer cancelar esta consulta?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim, cancelar',
        style: 'destructive',
        onPress: async () => {
          const r = await consultaService.atualizarConsulta(consulta.id, { estado: 'cancelada' });
          if (r.ok) carregar();
          else Alert.alert('Erro', r.message || 'Não foi possível cancelar');
        },
      },
    ]);

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  const ativas = consultas.filter((c) => c.estado === 'agendada' || c.estado === 'em_curso');
  const passadas = consultas.filter((c) => c.estado === 'concluida' || c.estado === 'cancelada');

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <PageHeader title="Consultas" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          <View style={{ marginTop: spacing.xl }}>
            <Button title="Marcar nova consulta" onPress={() => router.push('/agendar')} />
          </View>
          {erro ? <Text style={{ color: colors.danger, marginTop: spacing.md }}>{erro}</Text> : null}

          <Text style={[typography.title, { color: colors.primary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Próximas
          </Text>
          {ativas.length ? (
            ativas.map((c) => (
              <ConsultaCard
                key={c.id}
                consulta={c}
                onEntrar={() => router.push(`/telemedicine/${c.id}`)}
                onCancelar={() => cancelar(c)}
              />
            ))
          ) : (
            <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <Text style={typography.caption}>Sem consultas marcadas</Text>
            </Card>
          )}

          {passadas.length ? (
            <>
              <Text style={[typography.title, { color: colors.primary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
                Anteriores
              </Text>
              {passadas.map((c) => (
                <ConsultaCard key={c.id} consulta={c} onEntrar={() => {}} onCancelar={() => {}} />
              ))}
            </>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
