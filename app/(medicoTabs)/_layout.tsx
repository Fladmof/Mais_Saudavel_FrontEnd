import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/theme';

export default function MedicoTabsLayout() {
  const { status, user } = useAuth();
  if (status !== 'authenticated' || !user) return <Redirect href="/(auth)/welcome" />;
  if (user.role !== 'medico') return <Redirect href="/(tabs)" />;
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
          title: 'Início',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="horarios"
        options={{
          title: 'Horários',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="paciente/[id]" options={{ href: null }} />
      <Tabs.Screen name="marcar/[utenteId]" options={{ href: null }} />
    </Tabs>
  );
}
