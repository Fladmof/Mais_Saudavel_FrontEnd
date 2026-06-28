import { Stack } from "expo-router";
import Screen from "../../components/Screen";

export default function AuthLayout() {
  return (
    <Screen>
      <Stack screenOptions={{ headerShown: false }} />
    </Screen>
  );
}
