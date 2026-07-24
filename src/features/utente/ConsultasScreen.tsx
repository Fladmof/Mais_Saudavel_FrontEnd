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
import { documentoService } from '../../services/documentoService';
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
  const [validada, setValidada] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    const [r, rDocs] = await Promise.all([
      consultaService.minhasConsultas(),
      documentoService.estadoValidacao(),
    ]);
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
    if (rDocs.ok && rDocs.data) setValidada(rDocs.data.validacaoCompleta);
  }, []);

  // Sem conta autêntica não se marca consulta: encaminha para a validação.
  const irMarcar = () => router.push(validada ? '/agendar' : '/validacao-conta');

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
          {/* Uma só ação primária por ecrã: com consultas, o botão de topo é o CTA;
              sem consultas, o CTA passa para o EmptyState de "Próximas" (evita dois
              botões verdes iguais empilhados no estado vazio). */}
          {validada === false ? (
            <Text style={{ ...typography.caption, color: colors.warning, marginTop: spacing.lg }}>
              Valide a conta para marcar consultas.
            </Text>
          ) : null}
          {ativas.length ? (
            <View style={{ marginTop: spacing.md }}>
              <Button title="Marcar nova consulta" onPress={irMarcar} />
            </View>
          ) : null}
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
                acao={{ titulo: 'Marcar consulta', onPress: irMarcar }}
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
