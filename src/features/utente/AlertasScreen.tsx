import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { ServerError } from '../../components/ServerError';
import { notificacaoService } from '../../services/notificacaoService';
import { Notificacao } from '../../api/types';
import { colors, spacing, typography, fontFamily } from '../../theme';

// Aba "Alertas": notificacoes do utilizador (marcacoes, lembretes do medico).
// Tocar numa notificacao marca-a como lida; se tiver consulta associada abre-a.

export function AlertasScreen() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const carregar = useCallback(async () => {
    const r = await notificacaoService.listar();
    setLoading(false);
    setNetworkError(!!r.network);
    if (r.ok && r.data) setNotificacoes(r.data.notificacoes);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const abrir = async (n: Notificacao) => {
    if (!n.is_read) {
      await notificacaoService.marcarLida(n.id);
      carregar();
    }
  };

  const marcarTodas = async () => {
    await notificacaoService.marcarTodasLidas();
    carregar();
  };

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  const naoLidas = notificacoes.filter((n) => !n.is_read).length;

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <PageHeader title="Alertas" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          {naoLidas > 0 ? (
            <TouchableOpacity onPress={marcarTodas} style={{ alignSelf: 'flex-end', marginTop: spacing.lg }}>
              <Text style={{ color: colors.primary, fontFamily: fontFamily.medium, fontSize: 13 }}>
                Marcar todas como lidas
              </Text>
            </TouchableOpacity>
          ) : null}

          <View style={{ marginTop: spacing.lg }}>
            {notificacoes.length ? (
              notificacoes.map((n) => (
                <TouchableOpacity key={n.id} onPress={() => abrir(n)} activeOpacity={0.7}>
                  <Card style={{ marginBottom: spacing.md, opacity: n.is_read ? 0.65 : 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      {!n.is_read ? (
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.action }} />
                      ) : null}
                      <Text style={{ fontFamily: fontFamily.medium, fontSize: 15, flex: 1 }}>{n.title}</Text>
                    </View>
                    <Text style={[typography.caption, { marginTop: 4 }]}>{n.message}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 6 }}>
                      {new Date(n.createdAt).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))
            ) : (
              <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
                <Text style={typography.caption}>Sem alertas</Text>
              </Card>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
