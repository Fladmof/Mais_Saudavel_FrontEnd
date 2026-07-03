import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Avatar } from '../../components/Avatar';
import { InfoRow } from '../../components/InfoRow';
import { Section } from '../../components/Section';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { ServerError } from '../../components/ServerError';
import { utenteService } from '../../services/utenteService';
import { UtentePerfil } from '../../api/types';
import { colors, spacing, typography, fontFamily } from '../../theme';

// Ficha do Utente (Figma 75:390 / 127:410): cartao pessoal, dados biologicos,
// parametros de saude (smartwatch "Sem dados") e historico alimentar.

export function idadeDe(datanascimento?: string | null): string {
  if (!datanascimento) return '—';
  const nasc = new Date(datanascimento);
  if (isNaN(nasc.getTime())) return '—';
  const hoje = new Date();
  let anos = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--;
  return `${anos}`;
}

export function imcDe(peso?: number | null, altura?: number | null): string {
  if (!peso || !altura) return '—';
  const v = peso / (altura * altura);
  return isFinite(v) ? v.toFixed(1) : '—';
}

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
        borderRadius: 20,
        padding: 14,
        marginRight: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: colors.primary, fontSize: 14, fontFamily: fontFamily.medium }}>{titulo}</Text>
        <Image source={icone} resizeMode="contain" style={{ width: 24, height: 24 }} />
      </View>
      <View style={{ alignItems: 'center', marginVertical: spacing.md }}>
        <Image source={require('../../../assets/images/empty.png')} resizeMode="contain" />
      </View>
      <View style={{ backgroundColor: colors.action, paddingVertical: 4, borderRadius: 14, alignItems: 'center' }}>
        <Text style={{ color: colors.white, fontFamily: fontFamily.medium }}>Sem dados</Text>
      </View>
      <Text style={{ marginTop: spacing.md, textAlign: 'center', fontSize: 12, color: colors.placeholder, fontFamily: fontFamily.medium }}>
        sincronize o smartwatch para{'\n'}consultar leituras
      </Text>
    </View>
  );
}

type Edicao = { nome: string; telefone: string; morada: string; profissao: string; peso: string; altura: string };

export function FichaMedicaScreen() {
  const [perfil, setPerfil] = useState<UtentePerfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [erro, setErro] = useState('');
  const [editar, setEditar] = useState<Edicao | null>(null);
  const [aGuardar, setAGuardar] = useState(false);

  const carregar = useCallback(async () => {
    const r = await utenteService.fetchMeuPerfil();
    setLoading(false);
    setNetworkError(!!r.network);
    if (r.ok && r.data?.utente) {
      setPerfil(r.data.utente);
      setErro('');
    } else if (!r.network) {
      setErro(r.message || 'Falha ao carregar a ficha');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const brevemente = () =>
    Alert.alert('Disponível brevemente', 'Esta funcionalidade estará disponível numa próxima versão.');

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
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <View style={{ alignItems: 'center', backgroundColor: colors.white, paddingBottom: 14, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>
          <Text style={[typography.h2, { marginTop: spacing.md }]}>Ficha do Utente</Text>
          <View style={{ backgroundColor: colors.primary, flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 4, gap: 5, borderRadius: 12, marginTop: 14, alignItems: 'center' }}>
            <Image source={require('../../../assets/images/security.png')} />
            <Text style={{ color: colors.white, fontFamily: fontFamily.regular }}>Segurança da informação</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          <Card style={{ marginTop: spacing.xl, padding: spacing.xl }}>
            {erro ? <Text style={{ color: colors.danger }}>{erro}</Text> : null}
            {perfil && !editar ? (
              <>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <Avatar nome={perfil.user?.nome} size={90} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fontFamily.medium, fontSize: 16, marginBottom: 6 }}>{perfil.user?.nome}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 14 }}>{idadeDe(perfil.datanascimento)} anos - {perfil.genero}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 14 }}>Nº de utente: UT-{String(perfil.id).padStart(7, '0')}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 14 }}>{perfil.telefone}</Text>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: colors.textMuted, marginVertical: spacing.lg }} />
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>BI/Cartão de cidadão: {perfil.bi}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>Morada: {perfil.morada}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>Profissão: {perfil.profissao || '—'}</Text>
                <TouchableOpacity
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
                  style={{ position: 'absolute', top: spacing.lg, right: spacing.lg }}
                >
                  <Text style={{ color: colors.primary, fontFamily: fontFamily.medium }}>Editar</Text>
                </TouchableOpacity>
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
            <View style={{ backgroundColor: colors.tagBg, paddingVertical: 25, alignItems: 'center', borderRadius: 16 }}>
              <Text style={{ textAlign: 'center', color: colors.primary, fontSize: 15 }}>
                Ligue o seu smartwatch para sincronizar{'\n'}automaticamente os seus parâmetros de saúde
              </Text>
              <TouchableOpacity onPress={brevemente}>
                <View style={{ backgroundColor: colors.action, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginTop: 20 }}>
                  <Text style={{ color: colors.white, fontFamily: fontFamily.medium }}>Ligar dispositivo</Text>
                </View>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.lg }}>
              {PARAMETROS.map((p) => (
                <HealthCard key={p.titulo} titulo={p.titulo} icone={p.icone} />
              ))}
            </ScrollView>
          </Section>

          <Section title="Histórico alimentar">
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={brevemente}>
                <View style={{ backgroundColor: colors.action, paddingVertical: 8, paddingHorizontal: 80, borderRadius: 20 }}>
                  <Text style={{ color: colors.white, fontFamily: fontFamily.medium }}>Registrar refeição</Text>
                </View>
              </TouchableOpacity>
              <Card style={{ marginTop: spacing.lg, paddingVertical: 60, alignSelf: 'stretch', alignItems: 'center' }}>
                <Text style={{ color: colors.textMuted, fontSize: 15, fontFamily: fontFamily.medium }}>Sem registos alimentares</Text>
              </Card>
            </View>
          </Section>
        </View>
      </ScrollView>
    </Screen>
  );
}
