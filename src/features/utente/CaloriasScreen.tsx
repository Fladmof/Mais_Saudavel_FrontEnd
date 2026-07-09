import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { SelectField } from '../../components/SelectField';
import { ServerError } from '../../components/ServerError';
import { caloriasService } from '../../services/caloriasService';
import { RegistoCalorias, TipoRefeicao } from '../../api/types';
import { fotoUrlAbsoluta } from './HistoricoScreen';
import { colors, spacing, typography, fontFamily } from '../../theme';

// Historico alimentar com calorias: totais por periodo, lista de refeicoes e
// registo de nova refeicao (foto analisada por IA quando configurada no
// backend, ou estimativa por descricao).

type Periodo = 'hoje' | 'semana' | 'mes' | 'tudo';

const PERIODOS: { key: Periodo; label: string }[] = [
  { key: 'hoje', label: 'Hoje' },
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mês' },
  { key: 'tudo', label: 'Tudo' },
];

const REFEICOES: { key: TipoRefeicao; label: string }[] = [
  { key: 'pequeno_almoco', label: 'Pequeno-almoço' },
  { key: 'almoco', label: 'Almoço' },
  { key: 'lanche', label: 'Lanche' },
  { key: 'jantar', label: 'Jantar' },
];

const labelRefeicao = (t: TipoRefeicao) => REFEICOES.find((r) => r.key === t)?.label ?? t;

export function CaloriasScreen() {
  const [periodo, setPeriodo] = useState<Periodo>('hoje');
  const [registos, setRegistos] = useState<RegistoCalorias[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const [aAdicionar, setAAdicionar] = useState(false);
  const [tipoRefeicao, setTipoRefeicao] = useState<string>('Almoço');
  const [descricao, setDescricao] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [aEnviar, setAEnviar] = useState(false);

  const carregar = useCallback(async (p: Periodo = periodo) => {
    const r = await caloriasService.historico(p);
    setLoading(false);
    setNetworkError(!!r.network);
    if (r.ok && r.data) {
      setRegistos(r.data.registos);
      setTotal(r.data.totalCalorias);
    }
  }, [periodo]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const mudarPeriodo = (p: Periodo) => {
    setPeriodo(p);
    setLoading(true);
    carregar(p);
  };

  const escolherFoto = () => {
    const daCamara = async () => {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Alert.alert('Permissão necessária', 'Autorize o acesso à câmara.');
        return;
      }
      const foto = await ImagePicker.launchCameraAsync({ quality: 0.7 });
      if (!foto.canceled && foto.assets[0]) setFotoUri(foto.assets[0].uri);
    };
    const daGaleria = async () => {
      const foto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!foto.canceled && foto.assets[0]) setFotoUri(foto.assets[0].uri);
    };
    Alert.alert('Foto da refeição', 'Como quer adicionar a foto?', [
      { text: 'Câmara', onPress: daCamara },
      { text: 'Galeria', onPress: daGaleria },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const registar = async () => {
    if (!descricao.trim() && !fotoUri) {
      Alert.alert('Dados em falta', 'Adicione uma foto ou descreva a refeição (ex.: "arroz, frango e salada").');
      return;
    }
    setAEnviar(true);
    const tipo = REFEICOES.find((r) => r.label === tipoRefeicao)?.key ?? 'almoco';
    const r = await caloriasService.registarRefeicao({
      tipo_refeicao: tipo,
      descricao: descricao.trim() || undefined,
      fotoUri: fotoUri || undefined,
    });
    setAEnviar(false);
    if (r.ok && r.data) {
      const reg = r.data.registo;
      Alert.alert(
        'Refeição registada',
        `${reg.alimentos.join(', ') || 'Refeição'} — ${reg.calorias_total} kcal`
      );
      setDescricao('');
      setFotoUri(null);
      setAAdicionar(false);
      setLoading(true);
      carregar();
    } else {
      Alert.alert('Não foi possível registar', r.message || 'Tente novamente');
    }
  };

  const apagar = (reg: RegistoCalorias) =>
    Alert.alert('Remover refeição', 'Remover este registo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          const r = await caloriasService.apagar(reg.id);
          if (r.ok) carregar();
        },
      },
    ]);

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => carregar()} tintColor={colors.primary} />}
      >
        <PageHeader title="Histórico Alimentar" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl }}>
            {PERIODOS.map((p) => {
              const ativo = periodo === p.key;
              return (
                <TouchableOpacity key={p.key} onPress={() => mudarPeriodo(p.key)} style={{ flex: 1 }}>
                  <View
                    style={{
                      backgroundColor: ativo ? colors.primary : colors.white,
                      borderWidth: 1,
                      borderColor: ativo ? colors.primary : colors.border,
                      borderRadius: 20,
                      paddingVertical: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: ativo ? colors.white : colors.textSubtle, fontFamily: fontFamily.medium, fontSize: 13 }}>
                      {p.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <Card style={{ marginTop: spacing.lg, alignItems: 'center', paddingVertical: spacing.xl }}>
            <Text style={{ color: colors.textSubtle, fontSize: 13 }}>Total de calorias ({PERIODOS.find((p) => p.key === periodo)?.label.toLowerCase()})</Text>
            <Text style={{ color: colors.primary, fontSize: 36, fontFamily: fontFamily.bold, marginTop: 4 }}>
              {total} <Text style={{ fontSize: 16 }}>kcal</Text>
            </Text>
          </Card>

          {!aAdicionar ? (
            <View style={{ marginTop: spacing.lg }}>
              <Button title="Registar refeição" onPress={() => setAAdicionar(true)} />
            </View>
          ) : (
            <Card style={{ marginTop: spacing.lg }}>
              <Text style={[typography.title, { color: colors.primary }]}>Nova refeição</Text>
              <SelectField
                label="Tipo de refeição"
                value={tipoRefeicao}
                onValueChange={setTipoRefeicao}
                options={REFEICOES.map((r) => r.label)}
              />
              <TextField
                label="O que comeu?"
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Ex.: funge com muamba de galinha"
              />
              {fotoUri ? (
                <View style={{ marginTop: spacing.md }}>
                  <Image source={{ uri: fotoUri }} style={{ width: '100%', height: 160, borderRadius: 12 }} resizeMode="cover" />
                  <TouchableOpacity onPress={() => setFotoUri(null)} style={{ alignSelf: 'center', marginTop: spacing.sm }}>
                    <Text style={{ color: colors.danger, fontSize: 13, fontFamily: fontFamily.medium }}>Remover foto</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={escolherFoto} style={{ marginTop: spacing.md }}>
                  <Text style={{ color: colors.primary, fontFamily: fontFamily.medium, fontSize: 13 }}>
                    📷 Adicionar foto da refeição (opcional)
                  </Text>
                </TouchableOpacity>
              )}
              <View style={{ marginTop: spacing.lg, gap: spacing.sm }}>
                <Button title="Calcular e guardar" onPress={registar} loading={aEnviar} />
                <Button title="Cancelar" variant="ghost" onPress={() => setAAdicionar(false)} />
              </View>
            </Card>
          )}

          <Text style={[typography.title, { color: colors.primary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Refeições
          </Text>
          {registos.length ? (
            registos.map((reg) => {
              const foto = fotoUrlAbsoluta(reg.foto_url);
              return (
                <Card key={reg.id} style={{ marginBottom: spacing.md }}>
                  <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center' }}>
                    {foto ? (
                      <Image source={{ uri: foto }} style={{ width: 56, height: 56, borderRadius: 12 }} resizeMode="cover" />
                    ) : null}
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: fontFamily.medium, fontSize: 14 }}>{labelRefeicao(reg.tipo_refeicao)}</Text>
                        <Text style={{ color: colors.primary, fontFamily: fontFamily.bold }}>{reg.calorias_total} kcal</Text>
                      </View>
                      {reg.alimentos?.length ? (
                        <Text style={[typography.caption, { marginTop: 2 }]} numberOfLines={1}>
                          {reg.alimentos.join(', ')}
                        </Text>
                      ) : null}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                        <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                          {new Date(reg.data_refeicao).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })}
                          {reg.origem === 'ia' ? '  · estimado por IA' : ''}
                        </Text>
                        <TouchableOpacity onPress={() => apagar(reg)}>
                          <Text style={{ color: colors.danger, fontSize: 11, fontFamily: fontFamily.medium }}>Remover</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Card>
              );
            })
          ) : (
            <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
              <Text style={typography.caption}>Sem refeições neste período</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
