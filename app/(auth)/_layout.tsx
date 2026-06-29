import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AuthLayout() {
  const { status, user } = useAuth();
  if (status === 'authenticated' && user) {
    return <Redirect href={user.role === 'medico' ? '/(medicoTabs)' : '/(tabs)'} />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
