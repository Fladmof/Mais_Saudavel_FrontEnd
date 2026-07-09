import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { Section } from '../../components/Section';
import { TextField } from '../../components/TextField';
import { ServerError } from '../../components/ServerError';
import { Logo } from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';
import { consultaService } from '../../services/consultaService';
import { notificacaoService } from '../../services/notificacaoService';
import { utenteService } from '../../services/utenteService';
import { Consulta, UtentePerfil } from '../../api/types';
import { colors, spacing, typography, fontFamily } from '../../theme';

// Home do medico (Figma 178:655): cartao do medico, "Consultas marcadas"
// (titulo que faltava na app antiga) e lista/pesquisa de "Pacientes (N)".

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
    // 404 "nenhum utente" chega como ok=false: lista vazia
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

  // Envia um lembrete da consulta ao utente (aparece nos Alertas dele)
  const lembrar = async (c: Consulta) => {
    const r = await notificacaoService.notificarConsulta(c.id);
    if (r.ok) Alert.alert('Lembrete enviado', `${c.utente?.user?.nome ?? 'O paciente'} foi notificado.`);
    else Alert.alert('Erro', r.message || 'Não foi possível notificar');
  };

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  const medico = user?.medico;

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            backgroundColor: colors.white,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <Logo />
          <TouchableOpacity onPress={signOut} style={{ position: 'absolute', right: spacing.lg }}>
            <Text style={{ color: colors.danger, fontFamily: fontFamily.medium }}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          <Card style={{ flexDirection: 'row', gap: 20, alignItems: 'center', marginTop: spacing.xl, padding: spacing.xl, borderRadius: 32 }}>
            <Avatar nome={user?.nome} size={90} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fontFamily.medium, fontSize: 16, marginBottom: 8 }}>{user?.nome}</Text>
              <Text style={{ fontSize: 14, color: colors.textMuted }}>Especialidade: {medico?.especialidade ?? '—'}</Text>
              <Text style={{ fontSize: 14, color: colors.textMuted }}>Clínica: {medico?.hospital ?? '—'}</Text>
              <Text style={{ fontSize: 14, color: colors.textMuted }}>Nº de ordem: {medico?.crm ?? '—'}</Text>
              <Text style={{ fontSize: 14, color: colors.textMuted }}>Tel: {medico?.telefone ?? '—'}</Text>
            </View>
          </Card>

          <Section title="Consultas marcadas">
            <Card style={{ borderRadius: 32 }}>
              {consultas.length === 0 ? (
                <Text style={[typography.caption, { textAlign: 'center', paddingVertical: spacing.lg }]}>Sem consultas marcadas</Text>
              ) : (
                consultas.map((c) => (
                  <View
                    key={c.id}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.textSubtle }}>{c.utente?.user?.nome ?? 'Paciente'}</Text>
                      <View style={{ alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.primary, borderRadius: 35, paddingHorizontal: 10, paddingVertical: 2, marginTop: 4 }}>
                        <Text style={{ color: colors.primary, fontSize: 13 }}>{formatarDataHora(c.data_hora)}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                      <TouchableOpacity onPress={() => iniciar(c)}>
                        <View style={{ borderWidth: 1, borderColor: colors.primary, borderRadius: 35, paddingHorizontal: 10, paddingVertical: 4 }}>
                          <Text style={{ color: colors.primary, fontSize: 14 }}>{c.estado === 'em_curso' ? 'Retomar' : 'Iniciar'}</Text>
                        </View>
                      </TouchableOpacity>
                      {c.estado === 'agendada' ? (
                        <TouchableOpacity onPress={() => lembrar(c)}>
                          <View style={{ borderWidth: 1, borderColor: colors.primary, borderRadius: 35, paddingHorizontal: 10, paddingVertical: 4 }}>
                            <Text style={{ color: colors.primary, fontSize: 14 }}>Lembrar</Text>
                          </View>
                        </TouchableOpacity>
                      ) : null}
                      <TouchableOpacity onPress={() => cancelar(c)}>
                        <View style={{ borderWidth: 1, borderColor: colors.danger, borderRadius: 35, paddingHorizontal: 10, paddingVertical: 4 }}>
                          <Text style={{ color: colors.danger, fontSize: 14 }}>Cancelar</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </Card>
          </Section>

          <Section title={`Pacientes (${pacientes.length})`}>
            <TextField value={pesquisa} onChangeText={setPesquisa} placeholder="Pesquisar paciente pelo nome…" />
            <Card style={{ borderRadius: 32, marginTop: spacing.md }}>
              {pacientes.length === 0 ? (
                <Text style={[typography.caption, { textAlign: 'center', paddingVertical: spacing.lg }]}>Nenhum paciente encontrado</Text>
              ) : (
                pacientes.map((p) => (
                  <TouchableOpacity key={p.id} onPress={() => router.push(`/(medicoTabs)/paciente/${p.id}`)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                        <Avatar nome={p.user?.nome} size={36} />
                        <Text style={{ color: colors.textSubtle }}>{p.user?.nome ?? '—'}</Text>
                      </View>
                      <Image source={require('../../../assets/images/seened.png')} />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </Card>
          </Section>
        </View>
      </ScrollView>
    </Screen>
  );
}
