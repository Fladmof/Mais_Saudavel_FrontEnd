import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { Chip } from '../../components/Chip';
import { InfoRow } from '../../components/InfoRow';
import { Section } from '../../components/Section';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { ServerError } from '../../components/ServerError';
import { utenteService } from '../../services/utenteService';
import { clinicoService } from '../../services/clinicoService';
import { UtentePerfil, Medicacao, RegistoClinico, Alergia, CondicaoEspecial } from '../../api/types';
import { colors, spacing, typography, fontFamily } from '../../theme';
import { idadeDe, imcDe } from '../utente/FichaMedicaScreen';

// "Dados do paciente" (Figma 178:1015): vista read-only do medico sobre o utente
// (ficha + medicacao combinadas); o medico pode adicionar receitas e marcar consulta.

const TIPOS: { tipo: RegistoClinico['tipo']; titulo: string }[] = [
  { tipo: 'receita', titulo: 'Receitas médicas' },
  { tipo: 'exame', titulo: 'Exames' },
  { tipo: 'consulta', titulo: 'Consultas registadas' },
];

export function PacienteDetalheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [perfil, setPerfil] = useState<UtentePerfil | null>(null);
  const [medicacoes, setMedicacoes] = useState<Medicacao[]>([]);
  const [registos, setRegistos] = useState<RegistoClinico[]>([]);
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [condicoes, setCondicoes] = useState<CondicaoEspecial[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [novaReceita, setNovaReceita] = useState<{ titulo: string; descricao: string } | null>(null);
  const [aSubmeter, setASubmeter] = useState(false);

  const carregar = useCallback(async () => {
    if (!id) return;
    const r = await utenteService.obterUtente(id);
    setLoading(false);
    if (r.network) {
      setNetworkError(true);
      return;
    }
    setNetworkError(false);
    if (r.ok && r.data?.utente) {
      setPerfil(r.data.utente);
      const [rMeds, rRegs, rAlergias, rCondicoes] = await Promise.all([
        clinicoService.listarMedicacoes(r.data.utente.id),
        clinicoService.listarRegistos(r.data.utente.id),
        clinicoService.listarAlergias(r.data.utente.id),
        clinicoService.listarCondicoes(r.data.utente.id),
      ]);
      if (rMeds.ok && rMeds.data) setMedicacoes(rMeds.data.medicacoes);
      if (rRegs.ok && rRegs.data) setRegistos(rRegs.data.registos);
      if (rAlergias.ok && rAlergias.data) setAlergias(rAlergias.data.alergias);
      if (rCondicoes.ok && rCondicoes.data) setCondicoes(rCondicoes.data.condicoes);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const adicionarReceita = async () => {
    if (!perfil || !novaReceita || !novaReceita.titulo.trim()) return;
    setASubmeter(true);
    const r = await clinicoService.criarRegisto(perfil.id, {
      tipo: 'receita',
      titulo: novaReceita.titulo.trim(),
      descricao: novaReceita.descricao.trim() || undefined,
      data: new Date().toISOString().slice(0, 10),
    });
    setASubmeter(false);
    if (r.ok && r.data?.registo) {
      setRegistos((lista) => [r.data!.registo, ...lista]);
      setNovaReceita(null);
    } else {
      Alert.alert('Erro', r.message || 'Não foi possível adicionar a receita');
    }
  };

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.lg, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: spacing.md }}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={typography.h2}>Dados do paciente</Text>
        </View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          <Card style={{ marginTop: spacing.xl, padding: spacing.xl }}>
            {loading && !perfil ? <Text style={typography.caption}>A carregar…</Text> : null}
            {perfil ? (
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <Avatar nome={perfil.user?.nome} size={90} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fontFamily.medium, fontSize: 16, marginBottom: 6 }}>{perfil.user?.nome}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 14 }}>{idadeDe(perfil.datanascimento)} anos - {perfil.genero}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 14 }}>Nº de utente: UT-{String(perfil.id).padStart(7, '0')}</Text>
                  <Text style={{ color: colors.textMuted, fontSize: 14 }}>{perfil.telefone}</Text>
                </View>
              </View>
            ) : null}
          </Card>

          {perfil ? (
            <View style={{ marginTop: spacing.lg }}>
              <Button title="Marcar consulta" onPress={() => router.push(`/(medicoTabs)/marcar/${perfil.id}`)} />
            </View>
          ) : null}

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

          <Section title="Condições especiais">
            <Card>
              {condicoes.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' }}>
                  {condicoes.map((c) => (
                    <Chip key={c.id} label={c.nome} />
                  ))}
                </View>
              ) : (
                <Text style={[typography.caption, { textAlign: 'center' }]}>Sem condições registadas</Text>
              )}
            </Card>
          </Section>

          <Section title="Alergia registrada">
            <Card>
              {alergias.length ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.md }}>
                  {alergias.map((a) => (
                    <Chip key={a.id} label={a.severidade ? `${a.nome} (${a.severidade})` : a.nome} />
                  ))}
                </View>
              ) : (
                <Text style={[typography.caption, { textAlign: 'center', marginBottom: spacing.md }]}>Sem alergias registadas</Text>
              )}
              {perfil?.detalhes ? <InfoRow label="Descrição livre" value={perfil.detalhes} /> : null}
            </Card>
          </Section>

          <Section title="Medicação atual">
            <Card>
              {medicacoes.length === 0 ? (
                <Text style={[typography.caption, { textAlign: 'center' }]}>Sem medicação registada</Text>
              ) : (
                medicacoes.map((m) => (
                  <View key={m.id} style={{ paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                    <Text style={{ fontFamily: fontFamily.medium, fontSize: 15 }}>{m.nome}</Text>
                    <Text style={typography.caption}>{[m.dosagem, m.frequencia, m.horario].filter(Boolean).join(' · ') || '—'}</Text>
                  </View>
                ))
              )}
            </Card>
          </Section>

          <Section title="Históricos">
            <Card>
              {TIPOS.map((t, i) => {
                const itens = registos.filter((r) => r.tipo === t.tipo);
                return (
                  <View key={t.tipo} style={{ marginTop: i ? spacing.lg : 0 }}>
                    <Text style={{ fontFamily: fontFamily.medium, fontSize: 16 }}>{t.titulo}</Text>
                    {itens.length === 0 ? (
                      <Text style={typography.caption}>Sem registos</Text>
                    ) : (
                      itens.map((reg) => (
                        <View key={reg.id} style={{ marginTop: spacing.sm }}>
                          <Text style={{ fontSize: 14 }}>{reg.titulo}</Text>
                          <Text style={typography.caption}>{[reg.data, reg.descricao].filter(Boolean).join(' — ')}</Text>
                        </View>
                      ))
                    )}
                  </View>
                );
              })}
              {novaReceita ? (
                <View style={{ marginTop: spacing.lg }}>
                  <TextField label="Título da receita" value={novaReceita.titulo} onChangeText={(v) => setNovaReceita({ ...novaReceita, titulo: v })} placeholder="ex.: Amoxicilina 500mg" />
                  <TextField label="Descrição" value={novaReceita.descricao} onChangeText={(v) => setNovaReceita({ ...novaReceita, descricao: v })} placeholder="posologia e instruções" multiline />
                  <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
                    <Button title="Adicionar receita" onPress={adicionarReceita} loading={aSubmeter} />
                    <Button title="Cancelar" variant="ghost" onPress={() => setNovaReceita(null)} />
                  </View>
                </View>
              ) : (
                <View style={{ marginTop: spacing.lg }}>
                  <Button title="Adicionar receita" variant="ghost" onPress={() => setNovaReceita({ titulo: '', descricao: '' })} />
                </View>
              )}
            </Card>
          </Section>

          <View style={{ marginTop: spacing.xl }}>
            <Text style={[typography.title, { color: colors.danger, marginBottom: spacing.sm }]}>Contacto de emergência</Text>
            <Card>
              <Text style={{ fontFamily: fontFamily.medium, fontSize: 16, marginBottom: 4 }}>
                {perfil?.contato_emergencia || 'Sem contacto registado'}
              </Text>
              <Text style={{ color: colors.textSubtle }}>{perfil?.relacao || '—'}</Text>
              <Text style={{ color: colors.danger }}>{perfil?.telemergencia || '—'}</Text>
            </Card>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
