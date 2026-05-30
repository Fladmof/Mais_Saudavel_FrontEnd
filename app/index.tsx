import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();
  return (
    <ScrollView>
      <View style={{ display: 'flex', flex: 1, flexDirection: 'column', width: '100%' }}>
        <View style={{
          display: 'flex', flexDirection: 'row',
          justifyContent: 'center', position: 'absolute', left: '50%', right: '50%'
        }}>
          <Image source={require("../assets/images/mais-saudavel-logo.png")} />
        </View>
        <View style={{ width: '100%' }}>
          <Image source={require('../assets/images/smock1.png')} />
        </View>

        <View style={{ width: '100%', display: 'flex', alignItems: 'center', marginTop: -120 }}>
          <View>

            <Image source={require('../assets/images/healthcare.png')} />
            <View style={{ position: 'absolute', bottom: 12, right: 12 }}>
              <Image style={{ width: 90, height: 90 }} source={require('../assets/images/costumer.png')} />
            </View>
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
          <Text style={{
            textAlign: 'center', fontWeight: '700', fontSize: 34,
            color: '#1CA625'
          }}>
            Controle a sua saúde {'\n'} com o +Saudável
          </Text>
        </View>

        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
          <Text style={{
            textAlign: 'center', fontWeight: '400', fontSize: 15,
            color: '#626262'
          }}>
            O +Saudável centraliza tudo num {'\n'}
            único lugar, acessível a qualquer {'\n'}
            momento
          </Text>
        </View>

        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
          <Image source={require('../assets/images/outlook.png')}/>
        </View>
        
        <View style={{display: 'flex',flexDirection: 'row', justifyContent: 'center'}}>
          
          <TouchableOpacity style={{ marginTop: 60, width: 250 }} onPress={() => router.push("/(auth)/sign-in")}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', 
            backgroundColor: '#0DF205',
              justifyContent: 'space-between', paddingHorizontal: 60, borderRadius: 16, 
              paddingVertical: 0 }}>
              <View></View>  <Text style={{ fontWeight: '500', color: 'white' }}>Continuar</Text> 
              <Image style={{ marginRight: -70, marginVertical: -10 }} source={require('../assets/images/arrow.png')} />
            </View>
          </TouchableOpacity>
        </View>

        </View>
    </ScrollView>
  )
}

export default HomeScreen;


/*
import { useState } from "react";
import Login from './components/Login';
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
        <Image source={require("../assets/images/mais-saudavel-logo.png")} />

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



<View style={{ width: '98%', position: 'absolute', zIndex: 100, marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{
                marginLeft: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, borderWidth: 1, borderColor: '#B6B6B6', paddingHorizontal: 8,
                borderRadius: 12, paddingVertical: 2
              }}>
                <Image source={require('../assets/images/redDot.png')} />
                <Text style={{ color: '#808080', fontSize: 12, fontWeight: '400' }}>
                  09:12
                </Text>
              </View>
              <TouchableOpacity>
                <Image source={require('../assets/images/hide.png')} />
              </TouchableOpacity>
            </View>

*/