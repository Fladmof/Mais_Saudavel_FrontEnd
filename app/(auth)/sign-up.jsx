import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import SignUpComponent from "../components/sign-up";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.hero}>
        <Image source={require("../../assets/images/mais-saudavel-logo.png")} style={styles.logo} />
        <Text style={styles.heroText}>Comece a gerir os seus dados de saúde com um perfil seguro.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.tabs}>
          <TouchableOpacity style={styles.tabButton} onPress={() => router.push("/(auth)/sign-in")}>
            <Text style={styles.tabText}>Entrar</Text>
          </TouchableOpacity>
          <View style={[styles.tabButton, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeText]}>Criar conta</Text>
          </View>
        </View>

        <SignUpComponent />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F4F7FB',
  },
  pageContent: {
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 110,
    height: 26,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  heroText: {
    textAlign: 'center',
    color: '#5E6E7E',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#1A2A3A',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: '#F4F7FB',
    padding: 4,
    marginBottom: 22,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
  },
  activeTab: {
    backgroundColor: '#E7F8EA',
  },
  tabText: {
    color: '#7A8A9F',
    fontWeight: '600',
  },
  activeText: {
    color: '#1CA625',
  },
});




