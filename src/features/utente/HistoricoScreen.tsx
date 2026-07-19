import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Image, Alert, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ServerError } from '../../components/ServerError';
import { Touchable } from '../../components/Touchable';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/EmptyState';
import { clinicoService } from '../../services/clinicoService';
import { useAuth } from '../../context/AuthContext';
import { RegistoClinico, TipoRegisto } from '../../api/types';
import { BASE_URL } from '../../api/resolveBaseUrl';
import { colors, spacing, typography, fontFamily, radii } from '../../theme';

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
    <Screen>
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
                <Touchable
                  key={f.key}
                  onPress={() => setFiltro(f.key)}
                  accessibilityLabel={`Filtrar por ${f.label}`}
                  accessibilityRole="tab"
                  selected={ativo}
                  alvoMinimo={false}
                  style={{ marginRight: spacing.sm }}
                >
                  <View
                    style={{
                      backgroundColor: ativo ? colors.actionInk : colors.tagBg,
                      paddingHorizontal: spacing.lg,
                      paddingVertical: spacing.sm,
                      borderRadius: radii.md,
                      minHeight: spacing.touchMin,
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        ...typography.caption,
                        color: ativo ? colors.inkInverse : colors.actionInk,
                        fontFamily: fontFamily.medium,
                      }}
                    >
                      {f.label}
                    </Text>
                  </View>
                </Touchable>
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
                        <Image source={{ uri: foto }} style={{ width: 64, height: 64, borderRadius: radii.md }} resizeMode="cover" />
                      ) : null}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ ...typography.title, color: colors.ink, flex: 1 }}>{registo.titulo}</Text>
                          <View
                            style={{
                              backgroundColor: colors.tagBg,
                              paddingVertical: spacing.xs,
                              paddingHorizontal: spacing.sm,
                              borderRadius: radii.md,
                            }}
                          >
                            <Text style={{ ...typography.caption, color: colors.actionInk, fontFamily: fontFamily.medium }}>
                              {TIPO_LABEL[registo.tipo]}
                            </Text>
                          </View>
                        </View>
                        {registo.descricao ? (
                          <Text style={[typography.caption, { marginTop: spacing.xs }]} numberOfLines={2}>
                            {registo.descricao}
                          </Text>
                        ) : null}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                            <Text style={{ ...typography.caption, color: colors.inkMuted }}>
                              {registo.data ? new Date(registo.data).toLocaleDateString('pt-PT') : ''}
                            </Text>
                            {registo.validado_por_medico ? (
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                                <Icon nome="checkmark-circle" tamanho="sm" cor={colors.success} />
                                <Text style={{ ...typography.caption, color: colors.success }}>Validado por médico</Text>
                              </View>
                            ) : null}
                          </View>
                          <Touchable
                            onPress={() => apagar(registo)}
                            accessibilityLabel={`Remover ${registo.titulo}`}
                            alvoMinimo={false}
                          >
                            <Text style={{ ...typography.caption, color: colors.danger, fontFamily: fontFamily.medium }}>
                              Remover
                            </Text>
                          </Touchable>
                        </View>
                      </View>
                    </View>
                  </Card>
                );
              })
            ) : (
              <EmptyState
                icone="folder-open-outline"
                titulo="Sem registos neste filtro"
                descricao="Experimente outro filtro ou adicione uma receita, exame ou consulta."
              />
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
