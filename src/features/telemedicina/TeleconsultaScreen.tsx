import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Camera } from 'expo-camera';
import * as WebBrowser from 'expo-web-browser';
import type { Socket } from 'socket.io-client';
import { Screen } from '../../components/Screen';
import { Avatar } from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext';
import { consultaService } from '../../services/consultaService';
import { connectChat, joinRoom, sendMessage, mapHistoryRow, mapIncoming, ChatMessage } from '../../services/chatService';
import { Consulta } from '../../api/types';
import { colors, spacing, fontFamily } from '../../theme';

// Teleconsulta (Figma 160:495 paciente / 178:1305 medico): vídeo em ecrã cheio
// (Jitsi embutido num WebView), overlay de chat em tempo real (Socket.io) e
// controlo de terminar/sair por papel. A entrada na chamada é AUTOMÁTICA: assim
// que a consulta está `em_curso`, pede-se permissão de câmara/micro e liga-se —
// o médico inicia e já está na chamada; o utente entra e encontra o médico.

const ESTADOS_ATIVOS = ['agendada', 'em_curso'];

type EstadoVideo = 'inativo' | 'a_ligar' | 'ligado' | 'sem_permissao' | 'indisponivel';

// Sala Jitsi com pré-join desligado, deep-linking desligado (fica no WebView em
// vez de tentar abrir a app do Jitsi) e áudio/vídeo ligados à entrada.
function jitsiUrl(base: string, nome: string): string {
  const params = [
    'config.prejoinConfig.enabled=false',
    'config.prejoinPageEnabled=false',
    'config.disableDeepLinking=true',
    'config.startWithAudioMuted=false',
    'config.startWithVideoMuted=false',
    `userInfo.displayName="${encodeURIComponent(nome || 'Participante')}"`,
  ];
  return `${base}#${params.join('&')}`;
}

export function TeleconsultaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { consultaId } = useLocalSearchParams<{ consultaId: string }>();
  const { user } = useAuth();
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [erro, setErro] = useState('');
  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [texto, setTexto] = useState('');
  const [chatErro, setChatErro] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [estadoVideo, setEstadoVideo] = useState<EstadoVideo>('inativo');
  const socketRef = useRef<Socket | null>(null);
  const tentouLigar = useRef(false);

  const isMedico = user?.role === 'medico';

  const carregar = useCallback(async () => {
    if (!consultaId) return;
    const r = await consultaService.obterConsulta(consultaId);
    if (r.ok && r.data?.consulta) {
      const c = r.data.consulta;
      if (!ESTADOS_ATIVOS.includes(c.estado)) {
        setErro(c.estado === 'concluida' ? 'Esta consulta já foi concluída.' : 'Esta consulta foi cancelada.');
      }
      setConsulta(c);
    } else {
      setErro(r.message || 'Não foi possível carregar a consulta');
    }
  }, [consultaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // liga o chat quando a sala é conhecida
  useEffect(() => {
    if (!consulta?.room || !ESTADOS_ATIVOS.includes(consulta.estado)) return;
    let ativo = true;
    (async () => {
      const s = await connectChat();
      socketRef.current = s;
      s.on('connect_error', () => { if (ativo) setChatErro('Sem ligação ao chat'); });
      s.on('messages:history', (rows: any[]) => { if (ativo) setMensagens(rows.map(mapHistoryRow)); });
      s.on('message:received', (p: any) => { if (ativo) setMensagens((prev) => [...prev, mapIncoming(p)]); });
      s.on('message:system', (p: any) => { if (ativo) setMensagens((prev) => [...prev, mapIncoming({ ...p, type: 'system' })]); });
      const r = await joinRoom(s, user?.nome ?? 'Participante', consulta.room!);
      if (!r.ok && ativo) setChatErro(r.error ?? 'Sem acesso à sala');
      else if (ativo) setChatErro('');
    })();
    return () => {
      ativo = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [consulta?.room, consulta?.estado, user?.nome]);

  const enviar = async () => {
    const t = texto.trim();
    if (!t || !socketRef.current || !consulta?.room) return;
    setTexto('');
    const r = await sendMessage(socketRef.current, t, consulta.room);
    if (!r.ok) Alert.alert('Erro', r.error ?? 'Não foi possível enviar');
  };

  // Liga a chamada: pede câmara+micro e carrega a sala. Chamado automaticamente
  // quando a consulta está em curso, e disponível como "Tentar novamente".
  const ligarVideo = useCallback(async () => {
    if (!consultaId) return;
    setEstadoVideo('a_ligar');
    const cam = await Camera.requestCameraPermissionsAsync();
    const mic = await Camera.requestMicrophonePermissionsAsync();
    if (!cam.granted || !mic.granted) {
      setEstadoVideo('sem_permissao');
      return;
    }
    const r = await consultaService.videoUrl(consultaId);
    if (r.ok && r.data?.url) {
      setVideoUrl(r.data.url);
      setEstadoVideo('ligado');
    } else {
      setEstadoVideo('indisponivel');
    }
  }, [consultaId]);

  // Entrada automática: assim que a consulta está `em_curso`, liga sozinha.
  useEffect(() => {
    if (consulta?.estado === 'em_curso' && !tentouLigar.current) {
      tentouLigar.current = true;
      ligarVideo();
    }
  }, [consulta?.estado, ligarVideo]);

  // Fallback de último recurso (só aparece se a ligação in-app falhar).
  const abrirNoNavegador = async () => {
    if (!consultaId) return;
    const r = await consultaService.videoUrl(consultaId);
    if (r.ok && r.data?.url) await WebBrowser.openBrowserAsync(jitsiUrl(r.data.url, user?.nome ?? ''));
  };

  const terminar = () => {
    Alert.alert('Terminar consulta', 'Marcar esta consulta como concluída?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Terminar',
        style: 'destructive',
        onPress: async () => {
          const r = await consultaService.atualizarConsulta(consultaId!, { estado: 'concluida' });
          if (r.ok) router.back();
          else Alert.alert('Erro', r.message || 'Não foi possível terminar');
        },
      },
    ]);
  };

  const interlocutor = isMedico ? consulta?.utente?.user?.nome : consulta?.medico?.user?.nome;

  if (erro) {
    return (
      <Screen style={{ backgroundColor: '#101418' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl }}>
          <Text style={{ color: colors.white, fontFamily: fontFamily.medium, fontSize: 16, textAlign: 'center' }}>{erro}</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: spacing.xl }}>
            <Text style={{ color: colors.action, fontFamily: fontFamily.medium }}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  const legendaEstado: Record<EstadoVideo, string> = {
    inativo: 'À espera do início da consulta',
    a_ligar: 'A ligar câmara e microfone…',
    ligado: '',
    sem_permissao: 'Precisamos de acesso à câmara e ao microfone.',
    indisponivel: 'Não foi possível ligar o vídeo agora.',
  };

  return (
    <Screen style={{ backgroundColor: '#101418' }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        {/* área de vídeo */}
        <View style={{ flex: 1 }}>
          {videoUrl && estadoVideo === 'ligado' ? (
            <WebView
              source={{ uri: jitsiUrl(videoUrl, user?.nome ?? '') }}
              style={{ flex: 1, backgroundColor: '#000' }}
              javaScriptEnabled
              domStorageEnabled
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              mediaCapturePermissionGrantType="grant"
              originWhitelist={['*']}
              setSupportMultipleWindows={false}
              onError={() => {
                setVideoUrl(null);
                setEstadoVideo('indisponivel');
              }}
            />
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
              <Avatar nome={interlocutor} size={110} />
              <Text style={{ color: colors.white, fontFamily: fontFamily.medium, fontSize: 18, marginTop: spacing.lg }}>
                {interlocutor ?? 'A carregar…'}
              </Text>
              <Text style={{ color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' }}>
                {consulta?.estado === 'em_curso' ? legendaEstado[estadoVideo] : legendaEstado.inativo}
              </Text>

              {consulta?.estado === 'em_curso' && estadoVideo !== 'a_ligar' && estadoVideo !== 'ligado' ? (
                <TouchableOpacity
                  onPress={ligarVideo}
                  style={{
                    marginTop: spacing.xl,
                    backgroundColor: colors.action,
                    paddingHorizontal: spacing.xl,
                    paddingVertical: spacing.md,
                    borderRadius: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.sm,
                  }}
                >
                  <Ionicons name="videocam" size={18} color={colors.white} />
                  <Text style={{ color: colors.white, fontFamily: fontFamily.medium }}>
                    {estadoVideo === 'inativo' ? 'Ligar vídeo' : 'Tentar novamente'}
                  </Text>
                </TouchableOpacity>
              ) : null}

              {/* fallback discreto: só quando a ligação in-app falhou */}
              {consulta?.estado === 'em_curso' && (estadoVideo === 'indisponivel' || estadoVideo === 'sem_permissao') ? (
                <TouchableOpacity onPress={abrirNoNavegador} style={{ marginTop: spacing.md }}>
                  <Text style={{ color: colors.textMuted, textDecorationLine: 'underline' }}>Abrir no navegador</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          {/* barra de controlo */}
          <View style={{ position: 'absolute', top: spacing.md, left: spacing.md, right: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: '#00000080', borderRadius: 20, padding: spacing.sm }}>
              <Ionicons name="arrow-back" size={20} color={colors.white} />
            </TouchableOpacity>
            {estadoVideo === 'ligado' ? (
              <TouchableOpacity onPress={() => { setVideoUrl(null); setEstadoVideo('inativo'); tentouLigar.current = false; }} style={{ backgroundColor: '#00000080', borderRadius: 20, padding: spacing.sm }}>
                <Ionicons name="videocam-off" size={20} color={colors.white} />
              </TouchableOpacity>
            ) : null}
            {isMedico ? (
              <TouchableOpacity onPress={terminar} style={{ backgroundColor: colors.danger, borderRadius: 20, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
                <Text style={{ color: colors.white, fontFamily: fontFamily.medium }}>Terminar</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* overlay de chat — paddingBottom respeita a barra de navegação gestual */}
        <View
          style={{
            backgroundColor: '#161B20',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: Math.max(insets.bottom, spacing.md),
          }}
        >
          {chatErro ? <Text style={{ color: colors.danger, textAlign: 'center', marginBottom: spacing.sm }}>{chatErro}</Text> : null}
          <FlatList
            data={[...mensagens].reverse()}
            inverted
            style={{ height: 180 }}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) =>
              item.type === 'system' ? (
                <Text style={{ color: colors.textMuted, fontStyle: 'italic', textAlign: 'center', fontSize: 12, marginVertical: 2 }}>
                  {item.text}
                </Text>
              ) : (
                <View
                  style={{
                    alignSelf: item.userId === user?.id ? 'flex-end' : 'flex-start',
                    backgroundColor: item.userId === user?.id ? colors.primary : '#2A3138',
                    borderRadius: 12,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    marginVertical: 3,
                    maxWidth: '80%',
                  }}
                >
                  {item.userId !== user?.id ? (
                    <Text style={{ color: colors.action, fontSize: 11, fontFamily: fontFamily.medium }}>{item.username}</Text>
                  ) : null}
                  <Text style={{ color: colors.white }}>{item.text}</Text>
                </View>
              )
            }
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm }}>
            <TextInput
              value={texto}
              onChangeText={setTexto}
              placeholder="Escreva uma mensagem…"
              placeholderTextColor={colors.textMuted}
              style={{
                flex: 1,
                backgroundColor: '#2A3138',
                color: colors.white,
                borderRadius: 24,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                fontFamily: fontFamily.regular,
              }}
              onSubmitEditing={enviar}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={enviar} style={{ backgroundColor: colors.action, borderRadius: 24, padding: spacing.md }}>
              <Ionicons name="send" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
