import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.heroCard}>
        <View style={styles.logoRow}>
          <Image source={require("../assets/images/mais-saudavel-logo.png")} style={styles.logo} />
        </View>

        <Image source={require('../assets/images/smock1.png')} style={styles.heroImage} />

        <View style={styles.heroCopy}>
          <Text style={styles.title}>Controle a sua saúde{`\n`}com o +Saudável</Text>
          <Text style={styles.subtitle}>O +Saudável centraliza as informações num só lugar de forma clara e fácil.</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/(auth)/sign-in") }>
          <Text style={styles.primaryText}>Continuar</Text>
          <Image style={styles.arrowIcon} source={require('../assets/images/arrow.png')} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F4F7FB',
  },
  pageContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#1A2A3A',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
    alignItems: 'center',
  },
  logoRow: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 26,
    resizeMode: 'contain',
  },
  heroImage: {
    width: '100%',
    height: 240,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  heroCopy: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    color: '#1CA625',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 42,
  },
  subtitle: {
    marginTop: 16,
    textAlign: 'center',
    color: '#6B7885',
    fontSize: 16,
    lineHeight: 22,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1CA625',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 36,
    width: '100%',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  arrowIcon: {
    width: 18,
    height: 18,
    marginLeft: 12,
    resizeMode: 'contain',
  },
});
