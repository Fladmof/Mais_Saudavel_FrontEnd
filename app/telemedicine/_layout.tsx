import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function TelemedicineLayout() {
  const { status, user } = useAuth();
  if (status !== 'authenticated' || !user) return <Redirect href="/(auth)/welcome" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
