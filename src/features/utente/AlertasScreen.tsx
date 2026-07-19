import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { ServerError } from '../../components/ServerError';
import { Touchable } from '../../components/Touchable';
import { EmptyState } from '../../components/EmptyState';
import { notificacaoService } from '../../services/notificacaoService';
import { Notificacao } from '../../api/types';
import { colors, spacing, typography, fontFamily, radii } from '../../theme';

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
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <PageHeader title="Alertas" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          {naoLidas > 0 ? (
            <Touchable
              onPress={marcarTodas}
              accessibilityLabel="Marcar todos os alertas como lidos"
              style={{ alignSelf: 'flex-end', marginTop: spacing.lg }}
            >
              <Text style={{ ...typography.caption, color: colors.actionInk, fontFamily: fontFamily.medium }}>
                Marcar todas como lidas
              </Text>
            </Touchable>
          ) : null}

          <View style={{ marginTop: spacing.lg }}>
            {notificacoes.length ? (
              notificacoes.map((n) => (
                <Touchable
                  key={n.id}
                  onPress={() => abrir(n)}
                  accessibilityLabel={`${n.title}. ${n.is_read ? 'Lida' : 'Não lida'}`}
                  accessibilityHint={n.message}
                  alvoMinimo={false}
                >
                  <Card style={{ marginBottom: spacing.md }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      {!n.is_read ? (
                        <View
                          style={{
                            width: spacing.sm,
                            height: spacing.sm,
                            borderRadius: radii.full,
                            backgroundColor: colors.actionInk,
                          }}
                        />
                      ) : null}
                      <Text
                        style={{
                          ...typography.title,
                          fontFamily: n.is_read ? fontFamily.regular : fontFamily.bold,
                          color: colors.ink,
                          flex: 1,
                        }}
                      >
                        {n.title}
                      </Text>
                    </View>
                    <Text style={{ ...typography.body, color: colors.inkSecondary, marginTop: spacing.xs }}>
                      {n.message}
                    </Text>
                    <Text style={{ ...typography.caption, color: colors.inkMuted, marginTop: spacing.sm }}>
                      {new Date(n.createdAt).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' })}
                    </Text>
                  </Card>
                </Touchable>
              ))
            ) : (
              <EmptyState
                icone="notifications-outline"
                titulo="Sem alertas"
                descricao="Avisamos aqui quando houver novidades sobre as suas consultas."
              />
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
