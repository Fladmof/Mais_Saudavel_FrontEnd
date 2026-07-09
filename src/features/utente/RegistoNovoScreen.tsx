import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Screen } from '../../components/Screen';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { ServerError } from '../../components/ServerError';
import { clinicoService } from '../../services/clinicoService';
import { useAuth } from '../../context/AuthContext';
import { TipoRegisto } from '../../api/types';
import { colors, spacing, typography, fontFamily } from '../../theme';

// Adicionar receita medica ou exame ao historico: por foto (camara/galeria)
// e/ou descricao manual.

export function RegistoNovoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const utenteId = user?.utente?.id;

  const [tipo, setTipo] = useState<TipoRegisto>('receita');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [aEnviar, setAEnviar] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const escolherFoto = () => {
    const daCamara = async () => {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Alert.alert('Permissão necessária', 'Autorize o acesso à câmara.');
        return;
      }
      const foto = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (!foto.canceled && foto.assets[0]) setFotoUri(foto.assets[0].uri);
    };
    const daGaleria = async () => {
      const foto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!foto.canceled && foto.assets[0]) setFotoUri(foto.assets[0].uri);
    };
    Alert.alert('Adicionar foto', 'Como quer adicionar a foto do documento?', [
      { text: 'Câmara', onPress: daCamara },
      { text: 'Galeria', onPress: daGaleria },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const enviar = async () => {
    if (!utenteId) return;
    if (!titulo.trim()) {
      Alert.alert('Título necessário', 'Dê um nome ao registo (ex.: "Receita antibiótico").');
      return;
    }
    setAEnviar(true);
    const campos = {
      tipo,
      titulo: titulo.trim(),
      descricao: descricao.trim() || undefined,
      data: new Date().toISOString().slice(0, 10),
    };
    const r = fotoUri
      ? await clinicoService.criarRegistoComFoto(utenteId, campos, fotoUri)
      : await clinicoService.criarRegisto(utenteId, campos);
    setAEnviar(false);
    setNetworkError(!!r.network);
    if (r.ok) {
      Alert.alert('Guardado', `${tipo === 'receita' ? 'Receita' : 'Exame'} adicionado ao histórico.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else if (!r.network) {
      Alert.alert('Erro', r.message || 'Não foi possível guardar');
    }
  };

  if (networkError) return <ServerError onRetry={() => setNetworkError(false)} />;

  return (
    <Screen style={{ backgroundColor: '#F7F8FA' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <PageHeader title="Novo Registo" />
        <View style={{ paddingHorizontal: spacing.lg }}>
          <Text style={[typography.title, { color: colors.primary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Tipo de registo
          </Text>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {(['receita', 'exame'] as TipoRegisto[]).map((t) => {
              const ativo = tipo === t;
              return (
                <TouchableOpacity key={t} onPress={() => setTipo(t)} style={{ flex: 1 }}>
                  <View
                    style={{
                      backgroundColor: ativo ? colors.primary : colors.white,
                      borderWidth: 1,
                      borderColor: ativo ? colors.primary : colors.border,
                      borderRadius: 14,
                      paddingVertical: spacing.lg,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: ativo ? colors.white : colors.textSubtle, fontFamily: fontFamily.medium }}>
                      {t === 'receita' ? 'Receita médica' : 'Exame'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextField
            label="Título"
            value={titulo}
            onChangeText={setTitulo}
            placeholder={tipo === 'receita' ? 'Ex.: Receita antibiótico' : 'Ex.: Análises ao sangue'}
          />
          <TextField
            label="Descrição (opcional)"
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Detalhes do documento"
            multiline
          />

          <Text style={[typography.title, { color: colors.primary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Foto do documento (opcional)
          </Text>
          {fotoUri ? (
            <Card>
              <Image source={{ uri: fotoUri }} style={{ width: '100%', height: 220, borderRadius: 12 }} resizeMode="cover" />
              <TouchableOpacity onPress={() => setFotoUri(null)} style={{ marginTop: spacing.sm, alignSelf: 'center' }}>
                <Text style={{ color: colors.danger, fontFamily: fontFamily.medium, fontSize: 13 }}>Remover foto</Text>
              </TouchableOpacity>
            </Card>
          ) : (
            <TouchableOpacity onPress={escolherFoto}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderStyle: 'dashed',
                  borderRadius: 14,
                  paddingVertical: spacing.xxl,
                  alignItems: 'center',
                  backgroundColor: colors.white,
                }}
              >
                <Text style={{ color: colors.primary, fontFamily: fontFamily.medium }}>📷 Tirar foto ou escolher da galeria</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={{ marginTop: spacing.xl, gap: spacing.sm }}>
            <Button title="Guardar registo" onPress={enviar} loading={aEnviar} />
            <Button title="Cancelar" variant="ghost" onPress={() => router.back()} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
