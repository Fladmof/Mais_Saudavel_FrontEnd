import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { ServerError } from '../../components/ServerError';
import { documentoService } from '../../services/documentoService';
import { Documento, TipoDocumento, EstadoDocumento } from '../../api/types';
import { colors, spacing, typography, fontFamily } from '../../theme';

// Validacao de conta: o utente envia BI (frente e verso) + foto pessoal.
// O admin aprova/rejeita no painel web; aqui mostra-se o estado de cada documento.

const CARTOES: { tipo: TipoDocumento; label: string; hint: string }[] = [
  { tipo: 'bi_frente', label: 'BI — frente', hint: 'Fotografe a frente do Bilhete de Identidade' },
  { tipo: 'bi_verso', label: 'BI — verso', hint: 'Fotografe o verso do Bilhete de Identidade' },
  { tipo: 'foto_pessoal', label: 'Foto pessoal', hint: 'Tire uma selfie bem iluminada' },
];

const ESTADO_LABEL: Record<EstadoDocumento, string> = {
  pendente: 'Em análise',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
};

const ESTADO_COR: Record<EstadoDocumento, string> = {
  pendente: '#E8A200',
  aprovado: colors.primary,
  rejeitado: colors.danger,
};

export function ValidacaoContaScreen() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [completa, setCompleta] = useState(false);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [aEnviar, setAEnviar] = useState<TipoDocumento | null>(null);

  const carregar = useCallback(async () => {
    const r = await documentoService.estadoValidacao();
    setLoading(false);
    setNetworkError(!!r.network);
    if (r.ok && r.data) {
      setDocumentos(r.data.documentos);
      setCompleta(r.data.validacaoCompleta);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const escolherEEnviar = async (tipo: TipoDocumento) => {
    const enviar = async (uri: string) => {
      setAEnviar(tipo);
      const r = await documentoService.enviarDocumento(tipo, uri);
      setAEnviar(null);
      if (r.ok) {
        Alert.alert('Enviado', 'Documento em análise pela nossa equipa.');
        carregar();
      } else {
        Alert.alert('Erro', r.message || 'Não foi possível enviar');
      }
    };

    const daCamara = async () => {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Alert.alert('Permissão necessária', 'Autorize o acesso à câmara para fotografar o documento.');
        return;
      }
      const foto = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true });
      if (!foto.canceled && foto.assets[0]) enviar(foto.assets[0].uri);
    };

    const daGaleria = async () => {
      const foto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      if (!foto.canceled && foto.assets[0]) enviar(foto.assets[0].uri);
    };

    Alert.alert('Enviar documento', 'Como quer adicionar a foto?', [
      { text: 'Câmara', onPress: daCamara },
      { text: 'Galeria', onPress: daGaleria },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  if (networkError) return <ServerError onRetry={() => { setLoading(true); carregar(); }} />;

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} tintColor={colors.primary} />}
      >
        <PageHeader title="Validação de Conta" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          {completa ? (
            <View style={{ backgroundColor: colors.tagBg, borderRadius: 16, padding: spacing.lg, marginTop: spacing.xl, alignItems: 'center' }}>
              <Text style={{ color: colors.primary, fontFamily: fontFamily.medium, fontSize: 15 }}>
                ✓ Conta validada com sucesso
              </Text>
            </View>
          ) : (
            <Text style={[typography.caption, { marginTop: spacing.xl }]}>
              Para validar a sua conta envie os três documentos abaixo. A nossa equipa analisa-os e recebe o
              resultado aqui.
            </Text>
          )}

          <View style={{ marginTop: spacing.lg }}>
            {CARTOES.map((cartao) => {
              const doc = documentos.find((d) => d.tipo === cartao.tipo);
              return (
                <TouchableOpacity
                  key={cartao.tipo}
                  onPress={() => escolherEEnviar(cartao.tipo)}
                  disabled={aEnviar !== null || doc?.estado === 'aprovado'}
                  activeOpacity={0.7}
                >
                  <Card style={{ marginBottom: spacing.md }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: fontFamily.medium, fontSize: 15 }}>{cartao.label}</Text>
                        <Text style={[typography.caption, { marginTop: 2 }]}>
                          {aEnviar === cartao.tipo ? 'A enviar…' : doc ? '' : cartao.hint}
                        </Text>
                        {doc?.estado === 'rejeitado' && doc.motivo_rejeicao ? (
                          <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>
                            Motivo: {doc.motivo_rejeicao} — toque para reenviar
                          </Text>
                        ) : null}
                      </View>
                      <View
                        style={{
                          backgroundColor: doc ? `${ESTADO_COR[doc.estado]}1A` : colors.tagBg,
                          paddingVertical: 5,
                          paddingHorizontal: 12,
                          borderRadius: 14,
                        }}
                      >
                        <Text style={{ color: doc ? ESTADO_COR[doc.estado] : colors.primary, fontFamily: fontFamily.medium, fontSize: 12 }}>
                          {doc ? ESTADO_LABEL[doc.estado] : 'Enviar'}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
