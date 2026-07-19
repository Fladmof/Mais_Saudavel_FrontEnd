import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ServerError } from '../../components/ServerError';
import { Section } from '../../components/Section';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { consultaService } from '../../services/consultaService';
import { Consulta } from '../../api/types';
import { colors, spacing, typography } from '../../theme';

// Aba "Consultas" do utente: lista as consultas com estado e permite marcar
// nova consulta (fluxo /agendar), entrar na teleconsulta ou cancelar.

function ConsultaCard({ consulta, onEntrar, onCancelar }: { consulta: Consulta; onEntrar: () => void; onCancelar: () => void }) {
  const quando = new Date(consulta.data_hora).toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' });
  const nomeMedico = consulta.medico?.user?.nome ?? 'médico';
  return (
    <Card style={{ marginBottom: spacing.md }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={typography.title}>Dr(a). {consulta.medico?.user?.nome ?? '—'}</Text>
          <Text style={typography.caption}>{consulta.medico?.especialidade ?? ''}</Text>
          <Text style={[typography.caption, { marginTop: spacing.xs }]}>{quando}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: spacing.sm }}>
          <StatusBadge estado={consulta.estado} />
          {consulta.estado === 'em_curso' ? (
            <Button title="Entrar" onPress={onEntrar} accessibilityLabel={`Entrar na teleconsulta de ${nomeMedico}`} />
          ) : null}
          {consulta.estado === 'agendada' ? (
            <Button
              title="Cancelar"
              variant="danger"
              onPress={onCancelar}
              accessibilityLabel={`Cancelar consulta de ${nomeMedico}`}
            />
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
    <Screen>
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

          <Section title="Próximas">
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
              <EmptyState
                icone="calendar-outline"
                titulo="Ainda não tem consultas marcadas"
                descricao="Marque uma consulta para falar com um médico."
                acao={{ titulo: 'Marcar consulta', onPress: () => router.push('/agendar') }}
              />
            )}
          </Section>

          {passadas.length ? (
            <Section title="Anteriores">
              {passadas.map((c) => (
                <ConsultaCard key={c.id} consulta={c} onEntrar={() => {}} onCancelar={() => {}} />
              ))}
            </Section>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
