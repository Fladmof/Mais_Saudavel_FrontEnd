import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ServerError } from '../../components/ServerError';
import { clinicoService } from '../../services/clinicoService';
import { useAuth } from '../../context/AuthContext';
import { RegistoClinico, TipoRegisto } from '../../api/types';
import { BASE_URL } from '../../api/resolveBaseUrl';
import { colors, spacing, typography, fontFamily } from '../../theme';

// Aba "Histórico" do utente: registos clínicos (receitas, exames, consultas)
// com filtro por tipo, foto anexada e criação de novos registos.

type Filtro = 'todos' | TipoRegisto;

const FILTROS: { key: Filtro; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'receita', label: 'Receitas' },
  { key: 'exame', label: 'Exames' },
  { key: 'consulta', label: 'Consultas' },
];

const TIPO_LABEL: Record<TipoRegisto, string> = { receita: 'Receita', exame: 'Exame', consulta: 'Consulta' };

export function fotoUrlAbsoluta(fotoUrl?: string | null): string | null {
  if (!fotoUrl) return null;
  return fotoUrl.startsWith('http') ? fotoUrl : `${BASE_URL}${fotoUrl}`;
}

export function HistoricoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const utenteId = user?.utente?.id;
  const [registos, setRegistos] = useState<RegistoClinico[]>([]);
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    if (!utenteId) return;
    const r = await clinicoService.listarRegistos(utenteId);
    setLoading(false);
    setNetworkError(!!r.network);
    if (r.ok && r.data) {
      setRegistos(r.data.registos);
      setErro('');
    } else if (!r.network) {
      setErro(r.message || 'Falha ao carregar o histórico');
    }
  }, [utenteId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const apagar = (registo: RegistoClinico) =>
    Alert.alert('Remover registo', `Remover "${registo.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          const r = await clinicoService.apagarRegisto(registo.id);
          if (r.ok) carregar();
          else Alert.alert('Erro', r.message || 'Não foi possível remover');
        },
      },
    ]);

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  const filtrados = filtro === 'todos' ? registos : registos.filter((r) => r.tipo === filtro);

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <PageHeader title="Histórico Clínico" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          <View style={{ marginTop: spacing.xl }}>
            <Button title="Adicionar receita ou exame" onPress={() => router.push('/registo-novo')} />
          </View>
          {erro ? <Text style={{ color: colors.danger, marginTop: spacing.md }}>{erro}</Text> : null}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.lg }}>
            {FILTROS.map((f) => {
              const ativo = filtro === f.key;
              return (
                <TouchableOpacity key={f.key} onPress={() => setFiltro(f.key)} style={{ marginRight: spacing.sm }}>
                  <View
                    style={{
                      backgroundColor: ativo ? colors.primary : colors.tagBg,
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 20,
                    }}
                  >
                    <Text style={{ color: ativo ? colors.white : colors.primary, fontFamily: fontFamily.medium, fontSize: 13 }}>
                      {f.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={{ marginTop: spacing.lg }}>
            {filtrados.length ? (
              filtrados.map((registo) => {
                const foto = fotoUrlAbsoluta(registo.foto_url);
                return (
                  <Card key={registo.id} style={{ marginBottom: spacing.md }}>
                    <View style={{ flexDirection: 'row', gap: spacing.md }}>
                      {foto ? (
                        <Image source={{ uri: foto }} style={{ width: 64, height: 64, borderRadius: 12 }} resizeMode="cover" />
                      ) : null}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontFamily: fontFamily.medium, fontSize: 15, flex: 1 }}>{registo.titulo}</Text>
                          <View style={{ backgroundColor: colors.tagBg, paddingVertical: 3, paddingHorizontal: 10, borderRadius: 12 }}>
                            <Text style={{ color: colors.primary, fontSize: 11, fontFamily: fontFamily.medium }}>
                              {TIPO_LABEL[registo.tipo]}
                            </Text>
                          </View>
                        </View>
                        {registo.descricao ? (
                          <Text style={[typography.caption, { marginTop: 4 }]} numberOfLines={2}>
                            {registo.descricao}
                          </Text>
                        ) : null}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                          <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                            {registo.data ? new Date(registo.data).toLocaleDateString('pt-PT') : ''}
                            {registo.validado_por_medico ? '  ✓ validado por médico' : ''}
                          </Text>
                          <TouchableOpacity onPress={() => apagar(registo)}>
                            <Text style={{ color: colors.danger, fontSize: 12, fontFamily: fontFamily.medium }}>Remover</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Card>
                );
              })
            ) : (
              <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
                <Text style={typography.caption}>
                  {filtro === 'todos' ? 'Sem registos clínicos' : `Sem registos de ${FILTROS.find((f) => f.key === filtro)?.label.toLowerCase()}`}
                </Text>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
