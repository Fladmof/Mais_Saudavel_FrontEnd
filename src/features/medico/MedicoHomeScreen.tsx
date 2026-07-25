import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { Section } from '../../components/Section';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { Touchable } from '../../components/Touchable';
import { Icon } from '../../components/Icon';
import { Chip } from '../../components/Chip';
import { ServerError } from '../../components/ServerError';
import { useAuth } from '../../context/AuthContext';
import { consultaService } from '../../services/consultaService';
import { notificacaoService } from '../../services/notificacaoService';
import { utenteService } from '../../services/utenteService';
import { Consulta, UtentePerfil } from '../../api/types';
import { colors, spacing, typography } from '../../theme';

// Home do medico (Figma 178:655): cartao do medico, "Consultas marcadas" e
// lista/pesquisa de "Pacientes (N)".

export function formatarDataHora(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.toLocaleDateString('pt-PT')} ${d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`;
}

const ATIVAS = ['agendada', 'em_curso'];

export function MedicoHomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pacientes, setPacientes] = useState<UtentePerfil[]>([]);
  const [pesquisa, setPesquisa] = useState('');
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const carregar = useCallback(async () => {
    const [rConsultas, rPacientes] = await Promise.all([
      consultaService.minhasConsultas(),
      pesquisa.trim() ? utenteService.pesquisarUtentes(pesquisa.trim()) : utenteService.listarUtentes(),
    ]);
    setLoading(false);
    if (rConsultas.network && rPacientes.network) {
      setNetworkError(true);
      return;
    }
    setNetworkError(false);
    if (rConsultas.ok && rConsultas.data) {
      setConsultas(rConsultas.data.consultas.filter((c) => ATIVAS.includes(c.estado)));
    }
    setPacientes(rPacientes.ok && rPacientes.data ? rPacientes.data.utentes : []);
  }, [pesquisa]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const cancelar = (c: Consulta) => {
    Alert.alert('Cancelar consulta', `Cancelar a consulta com ${c.utente?.user?.nome ?? 'o paciente'}?`, [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim, cancelar',
        style: 'destructive',
        onPress: async () => {
          const r = await consultaService.atualizarConsulta(c.id, { estado: 'cancelada' });
          if (r.ok) carregar();
          else Alert.alert('Erro', r.message || 'Não foi possível cancelar');
        },
      },
    ]);
  };

  const iniciar = async (c: Consulta) => {
    if (c.estado === 'agendada') {
      const r = await consultaService.atualizarConsulta(c.id, { estado: 'em_curso' });
      if (!r.ok) {
        Alert.alert('Erro', r.message || 'Não foi possível iniciar');
        return;
      }
    }
    router.push(`/telemedicine/${c.id}`);
  };

  const lembrar = async (c: Consulta) => {
    const r = await notificacaoService.notificarConsulta(c.id);
    if (r.ok) Alert.alert('Lembrete enviado', `${c.utente?.user?.nome ?? 'O paciente'} foi notificado.`);
    else Alert.alert('Erro', r.message || 'Não foi possível notificar');
  };

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  const medico = user?.medico;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <PageHeader title="Início" onSignOut={signOut} />

        <View style={{ paddingHorizontal: spacing.lg }}>
          <Card style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center', marginTop: spacing.xl, padding: spacing.xl }}>
            <Avatar nome={user?.nome} size={90} />
            <View style={{ flex: 1 }}>
              <Text style={{ ...typography.title, color: colors.ink, marginBottom: spacing.xs }}>{user?.nome}</Text>
              <Text style={{ ...typography.caption, color: colors.inkMuted }}>Especialidade: {medico?.especialidade ?? '—'}</Text>
              <Text style={{ ...typography.caption, color: colors.inkMuted }}>Clínica: {medico?.hospital ?? '—'}</Text>
              <Text style={{ ...typography.caption, color: colors.inkMuted }}>Nº de ordem: {medico?.crm ?? '—'}</Text>
              <Text style={{ ...typography.caption, color: colors.inkMuted }}>Tel: {medico?.telefone ?? '—'}</Text>
            </View>
          </Card>

          <Section title="Consultas marcadas">
            {consultas.length === 0 ? (
              <EmptyState
                icone="calendar-outline"
                titulo="Sem consultas marcadas"
                descricao="As consultas marcadas pelos pacientes aparecem aqui."
              />
            ) : (
              consultas.map((c) => (
                <Card key={c.id} style={{ marginBottom: spacing.md }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md }}>
                    <View style={{ flex: 1, gap: spacing.xs, alignItems: 'flex-start' }}>
                      <Text style={{ ...typography.title, color: colors.ink }}>{c.utente?.user?.nome ?? 'Paciente'}</Text>
                      <Chip label={formatarDataHora(c.data_hora)} />
                      <StatusBadge estado={c.estado} />
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: spacing.sm }}>
                      <Button
                        title={c.estado === 'em_curso' ? 'Retomar' : 'Iniciar'}
                        variant="secondary"
                        onPress={() => iniciar(c)}
                        accessibilityLabel={`${c.estado === 'em_curso' ? 'Retomar' : 'Iniciar'} consulta com ${c.utente?.user?.nome ?? 'o paciente'}`}
                      />
                      {c.estado === 'agendada' ? (
                        <Button
                          title="Lembrar"
                          variant="ghost"
                          onPress={() => lembrar(c)}
                          accessibilityLabel={`Lembrar ${c.utente?.user?.nome ?? 'o paciente'} da consulta`}
                        />
                      ) : null}
                      <Button
                        title="Cancelar"
                        variant="danger"
                        onPress={() => cancelar(c)}
                        accessibilityLabel={`Cancelar consulta com ${c.utente?.user?.nome ?? 'o paciente'}`}
                      />
                    </View>
                  </View>
                </Card>
              ))
            )}
          </Section>

          <Section title={`Pacientes (${pacientes.length})`}>
            <TextField value={pesquisa} onChangeText={setPesquisa} placeholder="Pesquisar paciente pelo nome…" />
            {pacientes.length === 0 ? (
              <EmptyState icone="people-outline" titulo="Nenhum paciente encontrado" descricao="Os utentes registados aparecem aqui." />
            ) : (
              <Card style={{ marginTop: spacing.md }}>
                {pacientes.map((p) => (
                  <Touchable
                    key={p.id}
                    onPress={() => router.push(`/(medicoTabs)/paciente/${p.id}`)}
                    accessibilityLabel={`Ver ficha de ${p.user?.nome ?? 'paciente'}`}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                      <Avatar nome={p.user?.nome} size={36} />
                      <Text style={{ ...typography.body, color: colors.inkSecondary }}>{p.user?.nome ?? '—'}</Text>
                    </View>
                    <Icon nome="chevron-forward" tamanho="sm" cor={colors.inkMuted} />
                  </Touchable>
                ))}
              </Card>
            )}
          </Section>
        </View>
      </ScrollView>
    </Screen>
  );
}
