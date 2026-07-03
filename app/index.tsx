import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { status, user } = useAuth();
  if (status !== 'authenticated' || !user) return <Redirect href="/(auth)/welcome" />;
  if (user.role === 'medico') return <Redirect href="/(medicoTabs)" />;
  return <Redirect href="/(tabs)" />;
}
