import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { SelectField } from '../../components/SelectField';
import { ServerError } from '../../components/ServerError';
import { clinicoService } from '../../services/clinicoService';
import { useAuth } from '../../context/AuthContext';
import { Alergia, CondicaoEspecial, Severidade } from '../../api/types';
import { colors, spacing, typography, fontFamily } from '../../theme';

// Edicao de alergias (com severidade) e condicoes especiais do utente.
// Tocar numa etiqueta remove-a (com confirmacao).

const SEVERIDADES: Severidade[] = ['leve', 'moderada', 'grave'];

const COR_SEVERIDADE: Record<Severidade, string> = {
  leve: colors.primary,
  moderada: '#E8A200',
  grave: colors.danger,
};

export function AlergiasScreen() {
  const { user } = useAuth();
  const utenteId = user?.utente?.id;
  const [alergias, setAlergias] = useState<Alergia[]>([]);
  const [condicoes, setCondicoes] = useState<CondicaoEspecial[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const [novaAlergia, setNovaAlergia] = useState('');
  const [severidade, setSeveridade] = useState<string>('moderada');
  const [novaCondicao, setNovaCondicao] = useState('');
  const [aGuardar, setAGuardar] = useState(false);

  const carregar = useCallback(async () => {
    if (!utenteId) return;
    const [ra, rc] = await Promise.all([
      clinicoService.listarAlergias(utenteId),
      clinicoService.listarCondicoes(utenteId),
    ]);
    setLoading(false);
    setNetworkError(!!ra.network || !!rc.network);
    if (ra.ok && ra.data) setAlergias(ra.data.alergias);
    if (rc.ok && rc.data) setCondicoes(rc.data.condicoes);
  }, [utenteId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const adicionarAlergia = async () => {
    if (!utenteId || !novaAlergia.trim()) return;
    setAGuardar(true);
    const r = await clinicoService.criarAlergia(utenteId, {
      nome: novaAlergia.trim(),
      severidade: severidade as Severidade,
    });
    setAGuardar(false);
    if (r.ok) {
      setNovaAlergia('');
      carregar();
    } else {
      Alert.alert('Erro', r.message || 'Não foi possível adicionar');
    }
  };

  const removerAlergia = (a: Alergia) =>
    Alert.alert('Remover alergia', `Remover "${a.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          const r = await clinicoService.apagarAlergia(a.id);
          if (r.ok) carregar();
        },
      },
    ]);

  const adicionarCondicao = async () => {
    if (!utenteId || !novaCondicao.trim()) return;
    setAGuardar(true);
    const r = await clinicoService.criarCondicao(utenteId, { nome: novaCondicao.trim() });
    setAGuardar(false);
    if (r.ok) {
      setNovaCondicao('');
      carregar();
    } else {
      Alert.alert('Erro', r.message || 'Não foi possível adicionar');
    }
  };

  const removerCondicao = (c: CondicaoEspecial) =>
    Alert.alert('Remover condição', `Remover "${c.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          const r = await clinicoService.apagarCondicao(c.id);
          if (r.ok) carregar();
        },
      },
    ]);

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <PageHeader title="Alergias e Condições" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          <Text style={[typography.title, { color: colors.primary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Alergias
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {alergias.length ? (
              alergias.map((a) => (
                <TouchableOpacity key={a.id} onPress={() => removerAlergia(a)}>
                  <View
                    style={{
                      backgroundColor: `${COR_SEVERIDADE[a.severidade]}1A`,
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm,
                      borderRadius: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Text style={{ color: COR_SEVERIDADE[a.severidade], fontFamily: fontFamily.medium, fontSize: 13 }}>
                      {a.nome} ({a.severidade})
                    </Text>
                    <Text style={{ color: COR_SEVERIDADE[a.severidade], fontSize: 13 }}>×</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={typography.caption}>Sem alergias registadas</Text>
            )}
          </View>
          <Card style={{ marginTop: spacing.lg }}>
            <TextField label="Nova alergia" value={novaAlergia} onChangeText={setNovaAlergia} placeholder="Ex.: Penicilina" />
            <SelectField label="Severidade" value={severidade} onValueChange={setSeveridade} options={[...SEVERIDADES]} />
            <View style={{ marginTop: spacing.md }}>
              <Button title="Adicionar alergia" onPress={adicionarAlergia} loading={aGuardar} disabled={!novaAlergia.trim()} />
            </View>
          </Card>

          <Text style={[typography.title, { color: colors.primary, marginTop: spacing.xxl, marginBottom: spacing.sm }]}>
            Condições especiais
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {condicoes.length ? (
              condicoes.map((c) => (
                <TouchableOpacity key={c.id} onPress={() => removerCondicao(c)}>
                  <View
                    style={{
                      backgroundColor: colors.tagBg,
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm,
                      borderRadius: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Text style={{ color: colors.primary, fontFamily: fontFamily.medium, fontSize: 13 }}>{c.nome}</Text>
                    <Text style={{ color: colors.primary, fontSize: 13 }}>×</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={typography.caption}>Sem condições registadas</Text>
            )}
          </View>
          <Card style={{ marginTop: spacing.lg }}>
            <TextField label="Nova condição" value={novaCondicao} onChangeText={setNovaCondicao} placeholder="Ex.: Diabetes tipo 2" />
            <View style={{ marginTop: spacing.md }}>
              <Button title="Adicionar condição" onPress={adicionarCondicao} loading={aGuardar} disabled={!novaCondicao.trim()} />
            </View>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
