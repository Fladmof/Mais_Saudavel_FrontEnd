import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { ServerError } from '../../components/ServerError';
import { medicoService } from '../../services/medicoService';
import { agendamentoService } from '../../services/agendamentoService';
import { MedicoPerfil } from '../../api/types';
import { colors, spacing, typography, fontFamily } from '../../theme';

// Fluxo de agendamento do utente em 4 passos:
// especialidade -> medico -> data (14 dias) -> hora (slots livres) -> confirmar.

type Passo = 'especialidade' | 'medico' | 'dataHora' | 'confirmar';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function proximosDias(quantos: number, aPartirDe: Date = new Date()): { valor: string; diaSemana: string; dia: number }[] {
  const dias = [];
  for (let i = 1; i <= quantos; i++) {
    const d = new Date(aPartirDe);
    d.setDate(d.getDate() + i);
    const valor = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    dias.push({ valor, diaSemana: DIAS_SEMANA[d.getDay()], dia: d.getDate() });
  }
  return dias;
}

export function AgendarConsultaScreen() {
  const router = useRouter();
  const [passo, setPasso] = useState<Passo>('especialidade');
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [medicos, setMedicos] = useState<MedicoPerfil[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [aAgendar, setAAgendar] = useState(false);

  const [especialidade, setEspecialidade] = useState('');
  const [medico, setMedico] = useState<MedicoPerfil | null>(null);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [notas, setNotas] = useState('');

  const dias = proximosDias(14);

  const carregarEspecialidades = useCallback(async () => {
    const r = await medicoService.listarEspecialidades();
    setLoading(false);
    setNetworkError(!!r.network);
    if (r.ok && r.data) setEspecialidades(r.data);
  }, []);

  useEffect(() => {
    carregarEspecialidades();
  }, [carregarEspecialidades]);

  const escolherEspecialidade = async (esp: string) => {
    setEspecialidade(esp);
    setLoading(true);
    const r = await medicoService.listarMedicos(esp);
    setLoading(false);
    if (r.ok && r.data) {
      setMedicos(r.data);
      setPasso('medico');
    } else {
      Alert.alert('Erro', r.message || 'Não foi possível carregar os médicos');
    }
  };

  const escolherData = async (novaData: string) => {
    if (!medico) return;
    setData(novaData);
    setHora('');
    setLoadingSlots(true);
    const r = await agendamentoService.slotsDisponiveis(medico.id, novaData);
    setLoadingSlots(false);
    if (r.ok && r.data) setSlots(r.data.slots);
    else setSlots([]);
  };

  const confirmar = async () => {
    if (!medico || !data || !hora) return;
    setAAgendar(true);
    const r = await agendamentoService.agendar({ medico_id: medico.id, data, hora, notas: notas.trim() || undefined });
    setAAgendar(false);
    if (r.ok) {
      Alert.alert('Consulta agendada', `Dr(a). ${medico.user?.nome} — ${new Date(`${data}T${hora}`).toLocaleString('pt-PT', { dateStyle: 'long', timeStyle: 'short' })}`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else if (r.status === 403) {
      // Defesa do backend: sem conta validada não se marca. Encaminha à validação.
      Alert.alert('Conta por validar', 'Valide a sua conta antes de marcar consultas.', [
        { text: 'Validar conta', onPress: () => router.push('/validacao-conta') },
        { text: 'Cancelar', style: 'cancel' },
      ]);
    } else {
      Alert.alert('Não foi possível agendar', r.message || 'Tente outro horário');
      if (r.message?.includes('indisponível')) escolherData(data);
    }
  };

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregarEspecialidades(); }} />;

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <PageHeader title="Marcar Consulta" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          <TouchableOpacity
            onPress={() => {
              if (passo === 'especialidade') router.back();
              else if (passo === 'medico') setPasso('especialidade');
              else if (passo === 'dataHora') setPasso('medico');
              else setPasso('dataHora');
            }}
            style={{ marginTop: spacing.lg }}
          >
            <Text style={{ color: colors.primary, fontFamily: fontFamily.medium }}>← Voltar</Text>
          </TouchableOpacity>

          {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} /> : null}

          {!loading && passo === 'especialidade' ? (
            <>
              <Text style={[typography.h2, { color: colors.ink, marginTop: spacing.lg, marginBottom: spacing.sm }]}>
                Escolha a especialidade
              </Text>
              {especialidades.length ? (
                especialidades.map((esp) => (
                  <TouchableOpacity key={esp} onPress={() => escolherEspecialidade(esp)}>
                    <Card style={{ marginBottom: spacing.md }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: fontFamily.medium, fontSize: 15 }}>{esp}</Text>
                        <Text style={{ color: colors.primary }}>›</Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))
              ) : (
                <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
                  <Text style={typography.caption}>Ainda não há médicos disponíveis</Text>
                </Card>
              )}
            </>
          ) : null}

          {!loading && passo === 'medico' ? (
            <>
              <Text style={[typography.h2, { color: colors.ink, marginTop: spacing.lg, marginBottom: spacing.sm }]}>
                {especialidade}: escolha o médico
              </Text>
              {medicos.length ? (
                medicos.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => {
                      setMedico(m);
                      setData('');
                      setHora('');
                      setSlots([]);
                      setPasso('dataHora');
                    }}
                  >
                    <Card style={{ marginBottom: spacing.md }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                        <Avatar nome={m.user?.nome} size={52} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: fontFamily.medium, fontSize: 15 }}>Dr(a). {m.user?.nome ?? '—'}</Text>
                          <Text style={typography.caption}>{m.hospital}</Text>
                          <Text style={{ color: colors.primary, fontSize: 12, marginTop: 2 }}>
                            ★ {(m.avaliacao_media ?? 5).toFixed(1)} ({m.numero_avaliacoes ?? 0} avaliações)
                          </Text>
                        </View>
                        <Text style={{ color: colors.primary }}>›</Text>
                      </View>
                    </Card>
                  </TouchableOpacity>
                ))
              ) : (
                <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
                  <Text style={typography.caption}>Sem médicos nesta especialidade</Text>
                </Card>
              )}
            </>
          ) : null}

          {!loading && passo === 'dataHora' && medico ? (
            <>
              <Text style={[typography.h2, { color: colors.ink, marginTop: spacing.lg, marginBottom: spacing.sm }]}>
                Dr(a). {medico.user?.nome}: escolha o dia
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {dias.map((d) => {
                  const ativo = data === d.valor;
                  return (
                    <TouchableOpacity key={d.valor} onPress={() => escolherData(d.valor)} style={{ marginRight: spacing.sm }}>
                      <View
                        style={{
                          backgroundColor: ativo ? colors.primary : colors.white,
                          borderWidth: 1,
                          borderColor: ativo ? colors.primary : colors.border,
                          borderRadius: 14,
                          paddingVertical: 10,
                          paddingHorizontal: 14,
                          alignItems: 'center',
                          minWidth: 58,
                        }}
                      >
                        <Text style={{ color: ativo ? colors.white : colors.textSubtle, fontSize: 12 }}>{d.diaSemana}</Text>
                        <Text style={{ color: ativo ? colors.white : colors.black, fontFamily: fontFamily.medium, fontSize: 16 }}>
                          {d.dia}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {data ? (
                <>
                  <Text style={[typography.title, { color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
                    Horários disponíveis
                  </Text>
                  {loadingSlots ? (
                    <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
                  ) : slots.length ? (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                      {slots.map((s) => {
                        const ativo = hora === s;
                        return (
                          <TouchableOpacity key={s} onPress={() => setHora(s)}>
                            <View
                              style={{
                                backgroundColor: ativo ? colors.primary : colors.white,
                                borderWidth: 1,
                                borderColor: ativo ? colors.primary : colors.border,
                                borderRadius: 20,
                                paddingVertical: 8,
                                paddingHorizontal: 18,
                              }}
                            >
                              <Text style={{ color: ativo ? colors.white : colors.black, fontFamily: fontFamily.medium }}>{s}</Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
                      <Text style={typography.caption}>O médico não tem vagas neste dia</Text>
                    </Card>
                  )}
                  {hora ? (
                    <View style={{ marginTop: spacing.xl }}>
                      <Button title="Continuar" onPress={() => setPasso('confirmar')} />
                    </View>
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}

          {!loading && passo === 'confirmar' && medico ? (
            <>
              <Text style={[typography.h2, { color: colors.ink, marginTop: spacing.lg, marginBottom: spacing.sm }]}>
                Confirmar marcação
              </Text>
              <Card>
                <Text style={{ fontFamily: fontFamily.medium, fontSize: 16 }}>Dr(a). {medico.user?.nome}</Text>
                <Text style={typography.caption}>{especialidade} — {medico.hospital}</Text>
                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.md }} />
                <Text style={{ fontSize: 15 }}>
                  {new Date(`${data}T${hora}`).toLocaleString('pt-PT', { dateStyle: 'full', timeStyle: 'short' })}
                </Text>
              </Card>
              <TextField
                label="Notas para o médico (opcional)"
                value={notas}
                onChangeText={setNotas}
                placeholder="Ex.: dores de cabeça frequentes"
              />
              <View style={{ marginTop: spacing.xl }}>
                <Button title="Confirmar consulta" onPress={confirmar} loading={aAgendar} />
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
