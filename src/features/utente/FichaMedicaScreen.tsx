import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Image, Alert, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { InfoRow } from '../../components/InfoRow';
import { Section } from '../../components/Section';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { ServerError } from '../../components/ServerError';
import { Touchable } from '../../components/Touchable';
import { Icon } from '../../components/Icon';
import { StatusBadge, ESTADOS_CONSULTA } from '../../components/StatusBadge';
import { Chip } from '../../components/Chip';
import { utenteService } from '../../services/utenteService';
import { consultaService } from '../../services/consultaService';
import { clinicoService } from '../../services/clinicoService';
import { documentoService } from '../../services/documentoService';
import { UtentePerfil, Consulta, Alergia, CondicaoEspecial } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, fontFamily, radii } from '../../theme';
import { idadeDe, imcDe } from '../../utils/saude';

// Ficha do Utente (Figma 75:390 / 127:410): cartao pessoal, dados biologicos,
// parametros de saude (smartwatch "Sem dados") e historico alimentar.

export { idadeDe, imcDe };

const PARAMETROS = [
  { titulo: 'Batimento\ncardíaco', icone: require('../../../assets/images/wave.png') },
  { titulo: 'Pressão\narterial', icone: require('../../../assets/images/footsteps.png') },
  { titulo: 'Calorias\ningeridas', icone: require('../../../assets/images/footsteps.png') },
];

function HealthCard({ titulo, icone }: { titulo: string; icone: any }) {
  return (
    <View
      style={{
        width: 220,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        padding: spacing.md,
        marginRight: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ ...typography.caption, color: colors.actionInk, fontFamily: fontFamily.medium }}>{titulo}</Text>
        <Image source={icone} resizeMode="contain" style={{ width: 24, height: 24 }} />
      </View>
      <View style={{ alignItems: 'center', marginVertical: spacing.md }}>
        <Image source={require('../../../assets/images/empty.png')} resizeMode="contain" />
      </View>
      <View style={{ backgroundColor: colors.surfaceSunken, paddingVertical: spacing.xs, borderRadius: radii.md, alignItems: 'center' }}>
        <Text style={{ color: colors.inkMuted, fontFamily: fontFamily.medium }}>Sem dados</Text>
      </View>
      <Text
        style={{
          ...typography.caption,
          marginTop: spacing.md,
          textAlign: 'center',
          color: colors.inkMuted,
          fontFamily: fontFamily.medium,
        }}
      >
        sincronize o smartwatch para{'\n'}consultar leituras
      </Text>
    </View>
  );
}

type Edicao = { nome: string; telefone: string; morada: string; profissao: string; peso: string; altura: string };

export function FichaMedicaScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [perfil, setPerfil] = useState<UtentePerfil | null>(null);
  const [proxima, setProxima] = useState<Consulta | null>(null);
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [condicoes, setCondicoes] = useState<CondicaoEspecial[]>([]);
  const [contaValidada, setContaValidada] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [erro, setErro] = useState('');
  const [editar, setEditar] = useState<Edicao | null>(null);
  const [aGuardar, setAGuardar] = useState(false);

  const carregar = useCallback(async () => {
    const [r, rConsultas, rDocs] = await Promise.all([
      utenteService.fetchMeuPerfil(),
      consultaService.minhasConsultas(),
      documentoService.estadoValidacao(),
    ]);
    setLoading(false);
    setNetworkError(!!r.network);
    if (r.ok && r.data?.utente) {
      setPerfil(r.data.utente);
      setErro('');
      const [rAlergias, rCondicoes] = await Promise.all([
        clinicoService.listarAlergias(r.data.utente.id),
        clinicoService.listarCondicoes(r.data.utente.id),
      ]);
      if (rAlergias.ok && rAlergias.data) setAlergias(rAlergias.data.alergias);
      if (rCondicoes.ok && rCondicoes.data) setCondicoes(rCondicoes.data.condicoes);
    } else if (!r.network) {
      setErro(r.message || 'Falha ao carregar a ficha');
    }
    if (rConsultas.ok && rConsultas.data) {
      const ativas = rConsultas.data.consultas.filter((c) => c.estado === 'agendada' || c.estado === 'em_curso');
      setProxima(ativas[0] ?? null);
    }
    if (rDocs.ok && rDocs.data) setContaValidada(rDocs.data.validacaoCompleta);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const brevemente = () =>
    Alert.alert('Disponível brevemente', 'Esta funcionalidade estará disponível numa próxima versão.');

  const confirmarSair = () =>
    Alert.alert('Terminar sessão', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut() },
    ]);

  const guardar = async () => {
    if (!editar) return;
    setAGuardar(true);
    const r = await utenteService.atualizarMeuPerfil({
      nome: editar.nome.trim() || undefined,
      telefone: editar.telefone.trim(),
      morada: editar.morada.trim(),
      profissao: editar.profissao.trim(),
      peso: parseFloat(editar.peso) || perfil?.peso,
      altura: parseFloat(editar.altura) || perfil?.altura,
    });
    setAGuardar(false);
    if (r.ok && r.data?.utente) {
      setPerfil(r.data.utente);
      setEditar(null);
    } else {
      Alert.alert('Erro', r.message || 'Não foi possível guardar');
    }
  };

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <PageHeader title="Ficha do Utente" onSignOut={confirmarSair} />

        {contaValidada === false ? (
          <View
            style={{
              marginHorizontal: spacing.lg,
              marginTop: spacing.lg,
              backgroundColor: colors.warningSurface,
              borderRadius: radii.lg,
              padding: spacing.lg,
            }}
          >
            <Text style={{ ...typography.title, color: colors.warning }}>Conta por validar</Text>
            <Text style={{ ...typography.caption, color: colors.inkSecondary, marginTop: spacing.xs }}>
              Valide a sua conta para poder marcar consultas.
            </Text>
            <View style={{ marginTop: spacing.md }}>
              <Button title="Validar conta" onPress={() => router.push('/validacao-conta')} />
            </View>
          </View>
        ) : contaValidada ? (
          <View
            style={{
              marginHorizontal: spacing.lg,
              marginTop: spacing.lg,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.xs,
            }}
          >
            <Icon nome="checkmark-circle" tamanho="sm" cor={colors.success} />
            <Text style={{ ...typography.caption, color: colors.success, fontFamily: fontFamily.medium }}>
              Conta validada
            </Text>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: spacing.lg }}>
          <Card style={{ marginTop: spacing.xl, padding: spacing.xl }}>
            {erro ? <Text style={{ color: colors.danger }}>{erro}</Text> : null}
            {perfil && !editar ? (
              <>
                <View style={{ flexDirection: 'row', gap: spacing.lg }}>
                  <Avatar nome={perfil.user?.nome} size={90} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...typography.title, color: colors.ink, marginBottom: spacing.xs }}>
                      {perfil.user?.nome}
                    </Text>
                    <Text style={{ ...typography.caption, color: colors.inkMuted }}>
                      {idadeDe(perfil.datanascimento)} anos - {perfil.genero}
                    </Text>
                    <Text style={{ ...typography.caption, color: colors.inkMuted }}>
                      Nº de utente: UT-{String(perfil.id).padStart(7, '0')}
                    </Text>
                    <Text style={{ ...typography.caption, color: colors.inkMuted }}>{perfil.telefone}</Text>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.lg }} />
                <Text style={{ ...typography.caption, color: colors.inkMuted }}>BI/Cartão de cidadão: {perfil.bi}</Text>
                <Text style={{ ...typography.caption, color: colors.inkMuted }}>Morada: {perfil.morada}</Text>
                <Text style={{ ...typography.caption, color: colors.inkMuted }}>Profissão: {perfil.profissao || '—'}</Text>
                <Touchable
                  onPress={() =>
                    setEditar({
                      nome: perfil.user?.nome ?? '',
                      telefone: perfil.telefone ?? '',
                      morada: perfil.morada ?? '',
                      profissao: perfil.profissao ?? '',
                      peso: String(perfil.peso ?? ''),
                      altura: String(perfil.altura ?? ''),
                    })
                  }
                  accessibilityLabel="Editar dados pessoais"
                  style={{ position: 'absolute', top: spacing.lg, right: spacing.lg }}
                >
                  <Text style={{ ...typography.caption, color: colors.actionInk, fontFamily: fontFamily.medium }}>
                    Editar
                  </Text>
                </Touchable>
              </>
            ) : null}
            {perfil && editar ? (
              <>
                <TextField label="Nome" value={editar.nome} onChangeText={(v) => setEditar({ ...editar, nome: v })} />
                <TextField label="Telefone" value={editar.telefone} onChangeText={(v) => setEditar({ ...editar, telefone: v })} keyboardType="phone-pad" />
                <TextField label="Morada" value={editar.morada} onChangeText={(v) => setEditar({ ...editar, morada: v })} />
                <TextField label="Profissão" value={editar.profissao} onChangeText={(v) => setEditar({ ...editar, profissao: v })} />
                <TextField label="Peso (kg)" value={editar.peso} onChangeText={(v) => setEditar({ ...editar, peso: v })} keyboardType="numeric" />
                <TextField label="Altura (m)" value={editar.altura} onChangeText={(v) => setEditar({ ...editar, altura: v })} keyboardType="numeric" />
                <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
                  <Button title="Guardar" onPress={guardar} loading={aGuardar} />
                  <Button title="Cancelar" variant="ghost" onPress={() => setEditar(null)} />
                </View>
              </>
            ) : null}
          </Card>

          <Section title="Próxima consulta">
            <Card>
              {proxima ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...typography.title, color: colors.ink }}>
                      Dr(a). {proxima.medico?.user?.nome ?? '—'}
                    </Text>
                    <Text style={typography.caption}>
                      {new Date(proxima.data_hora).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })}
                    </Text>
                  </View>
                  {proxima.estado === 'em_curso' ? (
                    <Button
                      title="Entrar"
                      onPress={() => router.push(`/telemedicine/${proxima.id}`)}
                      accessibilityLabel={`Entrar na teleconsulta com Dr(a). ${proxima.medico?.user?.nome ?? 'o seu médico'}`}
                    />
                  ) : (
                    // Tocar no estado explica porque ainda não se pode entrar —
                    // informação útil para quem aguarda a teleconsulta.
                    <Touchable
                      onPress={() =>
                        Alert.alert('Ainda não começou', 'A teleconsulta fica disponível quando o médico a iniciar.')
                      }
                      accessibilityLabel={`Estado da consulta: ${ESTADOS_CONSULTA[proxima.estado].rotulo}. A teleconsulta abre quando o médico a iniciar.`}
                    >
                      <StatusBadge estado={proxima.estado} />
                    </Touchable>
                  )}
                </View>
              ) : (
                <Text style={[typography.caption, { textAlign: 'center' }]}>Sem consultas marcadas</Text>
              )}
            </Card>
          </Section>

          <Section title="Alergias e condições">
            <Card>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {alergias.map((a) => (
                  <View
                    key={`a-${a.id}`}
                    style={{
                      backgroundColor: colors.dangerSurface,
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm,
                      borderRadius: radii.md,
                    }}
                  >
                    <Text style={{ ...typography.caption, color: colors.danger, fontFamily: fontFamily.medium }}>
                      {a.nome}
                    </Text>
                  </View>
                ))}
                {condicoes.map((c) => (
                  <Chip key={`c-${c.id}`} label={c.nome} />
                ))}
                {!alergias.length && !condicoes.length ? (
                  <Text style={typography.caption}>Sem alergias ou condições registadas</Text>
                ) : null}
              </View>
              <Touchable
                onPress={() => router.push('/alergias')}
                accessibilityLabel="Editar alergias e condições"
                style={{ marginTop: spacing.md, alignSelf: 'flex-end' }}
              >
                <Text style={{ ...typography.caption, color: colors.actionInk, fontFamily: fontFamily.medium }}>
                  Editar
                </Text>
              </Touchable>
            </Card>
          </Section>

          <Section title="Dados biológicos">
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <InfoRow label="Tipo sanguíneo" value={perfil?.gsanguineo} />
                <InfoRow label="Factor RH" value={perfil?.factorrh} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <InfoRow label="Peso/Altura" value={perfil ? `${perfil.peso} kg / ${perfil.altura} m` : '—'} />
                <InfoRow label="IMC" value={imcDe(perfil?.peso, perfil?.altura)} />
              </View>
            </Card>
          </Section>

          <Section title="Parâmetro de Saúde">
            <View style={{ backgroundColor: colors.tagBg, paddingVertical: spacing.xl, alignItems: 'center', borderRadius: radii.lg }}>
              <Text style={{ ...typography.body, textAlign: 'center', color: colors.actionInk }}>
                Ligue o seu smartwatch para sincronizar{'\n'}automaticamente os seus parâmetros de saúde
              </Text>
              <Touchable onPress={brevemente} accessibilityLabel="Ligar dispositivo">
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.borderStrong,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.lg,
                    borderRadius: radii.full,
                    marginTop: spacing.xl,
                  }}
                >
                  <Text style={{ color: colors.actionInk, fontFamily: fontFamily.medium }}>Ligar dispositivo</Text>
                </View>
              </Touchable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.lg }}>
              {PARAMETROS.map((p) => (
                <HealthCard key={p.titulo} titulo={p.titulo} icone={p.icone} />
              ))}
            </ScrollView>
          </Section>

          <Section title="Histórico alimentar">
            <View style={{ alignItems: 'center' }}>
              <Touchable onPress={() => router.push('/calorias')} accessibilityLabel="Registar refeição">
                <View style={{ backgroundColor: colors.action, paddingVertical: spacing.sm, paddingHorizontal: 80, borderRadius: radii.full }}>
                  <Text style={{ color: colors.inkOnAction, fontFamily: fontFamily.medium }}>Registar refeição</Text>
                </View>
              </Touchable>
              <Touchable
                onPress={() => router.push('/calorias')}
                accessibilityLabel="Ver histórico de calorias"
                style={{ marginTop: spacing.lg, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs }}
              >
                <Text style={{ ...typography.body, color: colors.actionInk, fontFamily: fontFamily.medium }}>
                  Ver histórico de calorias
                </Text>
                <Icon nome="arrow-forward" tamanho="sm" cor={colors.actionInk} />
              </Touchable>
            </View>
          </Section>

          <Section title="Conta">
            <Card>
              <Touchable
                onPress={() => router.push('/validacao-conta')}
                accessibilityLabel="Validar conta"
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm }}
              >
                <Text style={{ ...typography.caption, fontFamily: fontFamily.medium }}>Validação de conta</Text>
                {contaValidada == null ? null : contaValidada ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                    <Icon nome="checkmark-circle" tamanho="sm" cor={colors.success} />
                    <Text style={{ ...typography.caption, color: colors.success }}>Validada</Text>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                    <Icon nome="time-outline" tamanho="sm" cor={colors.warning} />
                    <Text style={{ ...typography.caption, color: colors.warning }}>Pendente</Text>
                  </View>
                )}
              </Touchable>
              <View style={{ height: 1, backgroundColor: colors.border }} />
              <Touchable
                onPress={() => router.push('/eliminar-conta')}
                accessibilityLabel="Eliminar conta"
                style={{ paddingVertical: spacing.sm, marginTop: spacing.xs }}
              >
                <Text style={{ ...typography.caption, color: colors.danger, fontFamily: fontFamily.medium }}>
                  Eliminar conta
                </Text>
              </Touchable>
            </Card>
          </Section>
        </View>
      </ScrollView>
    </Screen>
  );
}
