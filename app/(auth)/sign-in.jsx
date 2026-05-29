import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import Login from '../components/Login';
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('entrar');

  return (
    <ScrollView
     contentContainerStyle={{
      paddingTop: 20,
      paddingBottom: 40
     }}
    >
      <View style={styles.container}>
        <Image source={require("../../assets/images/mais-saudavel-logo.png")} />

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              tab === 'entrar' && styles.activeTab,
            ]}
            //onPress={() => setTab('entrar')}
          >
            <Text
              style={[
                styles.tabText,
                tab === 'entrar' && styles.activeText,
              ]}
            >
              Entrar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              tab === 'criar' && styles.activeTab,
            ]}
            //onPress={() => setTab('criar')}
            onPress={() => router.push("/(auth)/sign-up")}
          >
            <Text
              style={[
                styles.tabText,
                tab === 'criar' && styles.activeText,
              ]}
            >
              Criar conta
            </Text>

          </TouchableOpacity>
        </View>
                                                                                                              
        <Login /> 

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#F5F5F9',
    padding: 2,
    marginBottom: 20,
    marginTop: 10,
    width: '70%',
    alignItems: 'center'
  },
  tabButton: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 40,
    alignItems: 'center',
    borderRadius: 5
  },
  activeTab: {
    backgroundColor: '#FFFFFF'
  },
  tabText: {
    color: 'gray',
    fontWeight: '500'
  },
  activeText: {
    color: 'green',
    fontWeight: '500',
    fontSize: 14
  },
  inputField: {
    display: 'flex',
    flexDirection: 'column'
  }
});