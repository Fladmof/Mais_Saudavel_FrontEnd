import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Alert, RefreshControl, Image } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { Section } from '../../components/Section';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { ServerError } from '../../components/ServerError';
import { Avatar } from '../../components/Avatar';
import { Touchable } from '../../components/Touchable';
import { EmptyState } from '../../components/EmptyState';
import { utenteService } from '../../services/utenteService';
import { clinicoService } from '../../services/clinicoService';
import { consultaService } from '../../services/consultaService';
import { UtentePerfil, Medicacao, RegistoClinico, TipoRegisto, Consulta, Alergia, CondicaoEspecial } from '../../api/types';
import { colors, spacing, typography, fontFamily, radii } from '../../theme';

// Ecra "Medicação" do Figma (131:540): condicoes especiais, alergia registrada,
// medicacao atual (CRUD real), historicos (receitas/exames/consultas),
// medico assistente, contacto de emergencia e emergencia.

const HISTORICOS: { tipo: TipoRegisto; titulo: string; desc: string }[] = [
  { tipo: 'receita', titulo: 'Receitas médicas', desc: 'Tire uma fotografia ou carregue a\nimagem da receita' },
  { tipo: 'exame', titulo: 'Exames', desc: 'Registrar imagens para\nconsulta posterior' },
  { tipo: 'consulta', titulo: 'Consultas que me lembro', desc: 'Descreva o hospital, os exames\nrealizados, a receita e o médico' },
];

export function MedicacaoScreen() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<UtentePerfil | null>(null);
  const [proxima, setProxima] = useState<Consulta | null>(null);
  const [medicacoes, setMedicacoes] = useState<Medicacao[]>([]);
  const [registos, setRegistos] = useState<RegistoClinico[]>([]);
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [condicoes, setCondicoes] = useState<CondicaoEspecial[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [detalhes, setDetalhes] = useState('');
  const [aGuardarDetalhes, setAGuardarDetalhes] = useState(false);
  const [novaMed, setNovaMed] = useState<{ nome: string; dosagem: string; frequencia: string } | null>(null);
  const [novoRegisto, setNovoRegisto] = useState<{ tipo: TipoRegisto; titulo: string; descricao: string } | null>(null);
  const [aSubmeter, setASubmeter] = useState(false);

  const carregar = useCallback(async () => {
    const rPerfil = await utenteService.fetchMeuPerfil();
    if (rPerfil.network) {
      setLoading(false);
      setNetworkError(true);
      return;
    }
    setNetworkError(false);
    if (rPerfil.ok && rPerfil.data?.utente) {
      const u = rPerfil.data.utente;
      setPerfil(u);
      setDetalhes(u.detalhes ?? '');
      const [rMeds, rRegs, rConsultas, rAlergias, rCondicoes] = await Promise.all([
        clinicoService.listarMedicacoes(u.id),
        clinicoService.listarRegistos(u.id),
        consultaService.minhasConsultas(),
        clinicoService.listarAlergias(u.id),
        clinicoService.listarCondicoes(u.id),
      ]);
      if (rMeds.ok && rMeds.data) setMedicacoes(rMeds.data.medicacoes);
      if (rRegs.ok && rRegs.data) setRegistos(rRegs.data.registos);
      if (rAlergias.ok && rAlergias.data) setAlergias(rAlergias.data.alergias);
      if (rCondicoes.ok && rCondicoes.data) setCondicoes(rCondicoes.data.condicoes);
      if (rConsultas.ok && rConsultas.data) {
        const ativas = rConsultas.data.consultas.filter((c) => c.estado === 'agendada' || c.estado === 'em_curso');
        setProxima(ativas[0] ?? null);
      }
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const brevemente = () =>
    Alert.alert('Disponível brevemente', 'Esta funcionalidade estará disponível numa próxima versão.');

  const guardarDetalhes = async () => {
    setAGuardarDetalhes(true);
    const r = await utenteService.atualizarMeuPerfil({ detalhes: detalhes.trim() });
    setAGuardarDetalhes(false);
    if (!r.ok) Alert.alert('Erro', r.message || 'Não foi possível guardar');
  };

  const abrirNovaMedicacao = () => setNovaMed({ nome: '', dosagem: '', frequencia: '' });

  const adicionarMedicacao = async () => {
    if (!perfil || !novaMed || !novaMed.nome.trim()) return;
    setASubmeter(true);
    const r = await clinicoService.criarMedicacao(perfil.id, {
      nome: novaMed.nome.trim(),
      dosagem: novaMed.dosagem.trim() || undefined,
      frequencia: novaMed.frequencia.trim() || undefined,
    });
    setASubmeter(false);
    if (r.ok && r.data?.medicacao) {
      setMedicacoes((m) => [r.data!.medicacao, ...m]);
      setNovaMed(null);
    } else {
      Alert.alert('Erro', r.message || 'Não foi possível adicionar');
    }
  };

  const removerMedicacao = (m: Medicacao) => {
    Alert.alert('Remover medicação', `Remover "${m.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          const r = await clinicoService.apagarMedicacao(m.id);
          if (r.ok) setMedicacoes((lista) => lista.filter((x) => x.id !== m.id));
          else Alert.alert('Erro', r.message || 'Não foi possível remover');
        },
      },
    ]);
  };

  const adicionarRegisto = async () => {
    if (!perfil || !novoRegisto || !novoRegisto.titulo.trim()) return;
    setASubmeter(true);
    const r = await clinicoService.criarRegisto(perfil.id, {
      tipo: novoRegisto.tipo,
      titulo: novoRegisto.titulo.trim(),
      descricao: novoRegisto.descricao.trim() || undefined,
      data: new Date().toISOString().slice(0, 10),
    });
    setASubmeter(false);
    if (r.ok && r.data?.registo) {
      setRegistos((lista) => [r.data!.registo, ...lista]);
      setNovoRegisto(null);
    } else {
      Alert.alert('Erro', r.message || 'Não foi possível adicionar');
    }
  };

  const removerRegisto = (reg: RegistoClinico) => {
    Alert.alert('Remover registo', `Remover "${reg.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          const r = await clinicoService.apagarRegisto(reg.id);
          if (r.ok) setRegistos((lista) => lista.filter((x) => x.id !== reg.id));
          else Alert.alert('Erro', r.message || 'Não foi possível remover');
        },
      },
    ]);
  };

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <PageHeader title="Medicação" />

        <View style={{ paddingHorizontal: spacing.lg }}>
          <Section title="Condições especiais">
            {condicoes.length ? (
              <Card>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' }}>
                  {condicoes.map((c) => (
                    <Chip key={c.id} label={c.nome} />
                  ))}
                </View>
              </Card>
            ) : (
              <EmptyState
                icone="alert-circle-outline"
                titulo="Sem condições registadas"
                descricao="As suas alergias e condições especiais aparecem aqui."
                acao={{ titulo: 'Editar na Ficha', onPress: () => router.push('/(tabs)') }}
              />
            )}
          </Section>

          <Section title="Alergia registrada">
            <Card>
              <Text style={[typography.caption, { textAlign: 'center', marginBottom: spacing.md }]}>
                Selecione as categorias aplicáveis e descreva os detalhes abaixo
              </Text>
              {alergias.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.md }}>
                  {alergias.map((a) => (
                    <Chip key={a.id} label={a.severidade ? `${a.nome} (${a.severidade})` : a.nome} />
                  ))}
                </View>
              ) : null}
              <TextField label="Descrição livre" value={detalhes} onChangeText={setDetalhes} placeholder="Amendoim e pólen" multiline />
              <View style={{ marginTop: spacing.md }}>
                <Button title="Guardar descrição" variant="ghost" onPress={guardarDetalhes} loading={aGuardarDetalhes} />
              </View>
            </Card>
          </Section>

          <Section title="Medicação atual">
            {medicacoes.length === 0 && !novaMed ? (
              <EmptyState
                icone="medkit-outline"
                titulo="Sem medicação registada"
                descricao="Adicione os medicamentos que toma para não se esquecer das tomas."
                acao={{ titulo: 'Adicionar medicação', onPress: abrirNovaMedicacao }}
              />
            ) : (
              <Card>
                {medicacoes.map((m) => (
                  <View
                    key={m.id}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...typography.title, color: colors.ink }}>{m.nome}</Text>
                      <Text style={typography.caption}>
                        {[m.dosagem, m.frequencia, m.horario].filter(Boolean).join(' · ') || '—'}
                      </Text>
                    </View>
                    <Touchable onPress={() => removerMedicacao(m)} accessibilityLabel={`Remover ${m.nome}`}>
                      <Text style={{ ...typography.caption, color: colors.danger, fontFamily: fontFamily.medium }}>Remover</Text>
                    </Touchable>
                  </View>
                ))}
                {novaMed ? (
                  <View style={{ marginTop: spacing.md }}>
                    <TextField label="Nome" value={novaMed.nome} onChangeText={(v) => setNovaMed({ ...novaMed, nome: v })} placeholder="ex.: Paracetamol" />
                    <TextField label="Dosagem" value={novaMed.dosagem} onChangeText={(v) => setNovaMed({ ...novaMed, dosagem: v })} placeholder="ex.: 500mg" />
                    <TextField label="Frequência" value={novaMed.frequencia} onChangeText={(v) => setNovaMed({ ...novaMed, frequencia: v })} placeholder="ex.: 8/8h" />
                    <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
                      <Button title="Adicionar" onPress={adicionarMedicacao} loading={aSubmeter} />
                      <Button title="Cancelar" variant="ghost" onPress={() => setNovaMed(null)} />
                    </View>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center', marginTop: spacing.md }}>
                    <Button title="Adicionar" variant="secondary" icone="add" onPress={abrirNovaMedicacao} />
                  </View>
                )}
              </Card>
            )}
          </Section>

          <Section title="Históricos">
            <Card>
              {HISTORICOS.map((h, i) => {
                const itens = registos.filter((r) => r.tipo === h.tipo);
                return (
                  <View key={h.tipo} style={{ borderTopWidth: i ? 1 : 0, borderTopColor: colors.border, paddingTop: i ? spacing.lg : 0, marginTop: i ? spacing.lg : 0 }}>
                    <Text style={{ ...typography.title, color: colors.ink }}>{h.titulo}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, gap: spacing.md }}>
                      <Text style={[typography.caption, { color: colors.inkMuted, flex: 1 }]}>{h.desc}</Text>
                      <Button
                        title="Adicionar"
                        variant="secondary"
                        icone="add"
                        onPress={() => setNovoRegisto({ tipo: h.tipo, titulo: '', descricao: '' })}
                      />
                    </View>
                    {itens.map((reg) => (
                      <View key={reg.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ ...typography.caption, color: colors.ink }}>{reg.titulo}</Text>
                          <Text style={typography.caption}>{reg.data ?? ''}</Text>
                        </View>
                        <Touchable onPress={() => removerRegisto(reg)} accessibilityLabel={`Remover registo de ${reg.data}`}>
                          <Text style={{ ...typography.caption, color: colors.danger, fontFamily: fontFamily.medium }}>Remover</Text>
                        </Touchable>
                      </View>
                    ))}
                    {novoRegisto?.tipo === h.tipo ? (
                      <View style={{ marginTop: spacing.md }}>
                        <TextField label="Título" value={novoRegisto.titulo} onChangeText={(v) => setNovoRegisto({ ...novoRegisto, titulo: v })} placeholder="ex.: Receita do Dr. Silva" />
                        <TextField label="Descrição" value={novoRegisto.descricao} onChangeText={(v) => setNovoRegisto({ ...novoRegisto, descricao: v })} placeholder="detalhes" multiline />
                        <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
                          <Button title="Adicionar" onPress={adicionarRegisto} loading={aSubmeter} />
                          <Button title="Cancelar" variant="ghost" onPress={() => setNovoRegisto(null)} />
                        </View>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </Card>
          </Section>

          <Section title="Médico assistente">
            {proxima?.medico ? (
              <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <Avatar nome={proxima.medico.user?.nome} size={64} />
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typography.title, color: colors.ink }}>Dr(a). {proxima.medico.user?.nome}</Text>
                  <Text style={{ ...typography.caption, color: colors.inkMuted }}>{proxima.medico.especialidade}</Text>
                  <Text style={{ ...typography.caption, color: colors.inkMuted }}>{proxima.medico.telefone ?? '—'}</Text>
                  <Text style={{ ...typography.caption, color: colors.inkMuted }}>{proxima.medico.hospital}</Text>
                </View>
                <Touchable
                  onPress={() =>
                    proxima.estado === 'em_curso'
                      ? router.push(`/telemedicine/${proxima.id}`)
                      : Alert.alert('Sem teleconsulta ativa', 'A teleconsulta fica disponível quando o médico a iniciar.')
                  }
                  accessibilityLabel="Entrar na teleconsulta"
                  alvoMinimo={false}
                >
                  <View style={{ backgroundColor: colors.action, width: 120, height: spacing.touchMin, alignItems: 'center', justifyContent: 'center', borderRadius: radii.full }}>
                    <Image source={require('../../../assets/images/telemedicina.png')} />
                    <Text style={{ color: colors.inkOnAction }}>Telemedicina</Text>
                  </View>
                </Touchable>
              </Card>
            ) : (
              <EmptyState
                icone="person-outline"
                titulo="Sem médico assistente"
                descricao="Será associado quando tiver uma consulta marcada."
              />
            )}
          </Section>

          <View style={{ marginTop: spacing.xl }}>
            <Text style={[typography.title, { color: colors.danger, marginBottom: spacing.sm }]}>Contacto de emergência</Text>
            <Card style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
              <View style={{ width: 64, height: 64, borderRadius: radii.full, backgroundColor: colors.dangerSurface, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ ...typography.title, color: colors.danger }}>
                  {(perfil?.contato_emergencia ?? '?').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?'}
                </Text>
              </View>
              <View>
                <Text style={{ ...typography.title, color: colors.ink, marginBottom: spacing.xs }}>
                  {perfil?.contato_emergencia || 'Sem contacto registado'}
                </Text>
                <Text style={{ ...typography.caption, color: colors.inkSecondary }}>{perfil?.relacao || '—'}</Text>
                <Text style={{ ...typography.caption, color: colors.danger }}>{perfil?.telemergencia || '—'}</Text>
              </View>
            </Card>
          </View>

          <Section title="Emergência">
            <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <Text style={{ ...typography.title, color: colors.inkMuted, fontFamily: fontFamily.bold, marginBottom: spacing.lg }}>
                Serviço indisponível
              </Text>
              <Touchable onPress={brevemente} accessibilityLabel="Chamar apoio">
                <View style={{ backgroundColor: colors.action, paddingVertical: spacing.sm, paddingHorizontal: 80, borderRadius: radii.full }}>
                  <Text style={{ color: colors.inkOnAction, fontFamily: fontFamily.medium }}>Chamar apoio</Text>
                </View>
              </Touchable>
            </Card>
          </Section>
        </View>
      </ScrollView>
    </Screen>
  );
}
