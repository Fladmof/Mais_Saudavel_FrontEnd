import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function TabsLayout() {
  const { status, user } = useAuth();
  if (status !== 'authenticated' || !user) return <Redirect href="/(auth)/login" />;
  if (user.role === 'medico') return <Redirect href="/(medicoTabs)" />;
  return <Tabs screenOptions={{ headerShown: false }} />;
}
