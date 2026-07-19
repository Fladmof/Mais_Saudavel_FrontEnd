import { useCallback, useState } from 'react';
import { Redirect, Tabs, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { notificacaoService } from '../../src/services/notificacaoService';
import { colors } from '../../src/theme';

export default function TabsLayout() {
  const { status, user } = useAuth();
  const [naoLidas, setNaoLidas] = useState(0);

  // Atualiza o badge de alertas sempre que as tabs ganham foco
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      notificacaoService.contagem().then((r) => {
        if (ativo && r.ok && r.data) setNaoLidas(r.data.naoLidas);
      });
      return () => {
        ativo = false;
      };
    }, [])
  );

  if (status !== 'authenticated' || !user) return <Redirect href="/(auth)/welcome" />;
  if (user.role === 'medico') return <Redirect href="/(medicoTabs)" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.actionInk,
        tabBarInactiveTintColor: colors.inkMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ficha',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="consultas"
        options={{
          title: 'Consultas',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="medication"
        options={{
          title: 'Medicação',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'medkit' : 'medkit-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'folder-open' : 'folder-open-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          tabBarBadge: naoLidas > 0 ? naoLidas : undefined,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'notifications' : 'notifications-outline'} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
