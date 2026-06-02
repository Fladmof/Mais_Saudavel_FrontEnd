import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, TextInput, TurboModuleRegistry } from "react-native";
import { useState } from "react";
import SignUpComponent from "../components/sign-up";
import { useRouter } from "expo-router";


export default function SignUp() {
  const router = useRouter();
  const [tab, setTab] = useState('criar');

  // user data structure
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordcheck, setPasswordcheck] = useState("");
  // personal info
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [telefone, setTelefone] = useState("");
  const [passport, setPassport] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [job, setJob] = useState("");
  //dados biológicos
const [factorRH, setFactorRH] = useState("");
const [bloodType, setBloodType] = useState("");
const [weight, setWeight] = useState("");
const [height, setHeight] = useState("");

// historico medico
const [alergia, setAlergia] = useState("");
const [specialCondition, setSpecialCondition] = useState("");
// contacto de emergência
const [emergencyContactName, setEmergencyContactName] = useState("");
const [emergencyContactRelatioship, setEmergencyContactRelatioship] = useState("");
const [emergencyContact, setEmergencyContact] = useState("");

const validateForm = () => {
  if(!email.trim()) {
    return "O email é obrigatorio"
  }
  if(!email.includes("@")) {
    return "Email inválido"
  }
  if(!password) {
    return "A senha é obrigatoria"
  }
  if(password.length < 6) {
    return "A senha deve ter pelo menos 6 caracteres"
  }
  if(password !== passwordcheck) {
    return "As senhas não coincidem"
  }
  if(!name.trim()) {
    return "O nome é obrigatorio"
  }
  if(!nickname.trim()) {
    return "O sobrenome é obrigatorio"
  }
  if(!birthdate.trim()) {
    return "A data de nascimento é obrigatoria"
  }
  if(!gender.trim()) {
    return "Selecione o género"
  }
  if(!telefone.trim()) {
    return "O telefone é obrigatorio"
  }
  if(!passport.trim()) {
    return "O número do documento é obrigatorio"
  }
  if(!neighborhood.trim()) {
     return "Informe a morada"
  }
  if(!job) {
    return "selecione profissão"
  }
  if(!alergia) {
    return "selecione alergia ou outro"
  }
  if(!specialCondition) {
    return "selecione condição especial ou outro"
  }
  if(!job) {
    return "selecione profissão"
  }
  if(!factorRH.trim()) {
    return "Selecione o factor RH"
  }
  if(!bloodType.trim()) {
    return "Selecione o grupo sanguínio"
  }
  if(!weight.trim()) {
    return "Infrome o peso"
  }
  if(Number(height) <= 0) {
    return "altura inválida"
  }
  if(!height) {
    return "Informe a altura"
  }
  if(!emergencyContactName.trim()) {
    return "Informe o contacto de emergência"
  }
  if(!emergencyContactRelatioship.trim()) {
    return "Informe o parentesco"
  }
  if(!emergencyContact.trim()) {
    return "Infrome o telefone de emergência"
  }

  return null;
}

const handleCreateAccount = () => {
    try {
      
      const error = validateForm();

      if (error) {
        Alert.alert("erro", error);
        console.log(error);
        return;
      }

      const payLoad = {
        email: email.trim(),
        password,
        name: name.trim(),
        nickname: nickname.trim(),
        birthdate,
        gender,
        telefone: telefone.trim(),
        passport: passport.trim(),
        neighborhood: neighborhood.trim(),
        job: job.trim(),
        factorRH,
        bloodType,
        weight: Number(weight),
        height: Number(height),
        alergia: alergia.trim(),
        specialCondition: specialCondition.trim(),
        emergencyContactName: emergencyContactName.trim(),
        setEmergencyContactRelatioship: emergencyContactRelatioship.trim(),
        emergencyContact: emergencyContact.trim(),
      };

      // payload preparado console.log("payload: ",payload)
      // BACKEND LIGA AQUI!!!!!!!!!!!!!!!!!!!!!!!!!! ----------------------------------

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "ocorreu um erro inseperado");
    }
};

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
            onPress={() => router.push("/(auth)/sign-in")}
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
            onPress={() => setTab('criar')}
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
                                                                                                              
        <SignUpComponent email={email} setEmail={setEmail}
                          password={password} setPassword={setPassword}
                          passwordcheck={passwordcheck} setPasswordcheck={setPasswordcheck}
                          name={name} setName={setName}
                          nickname={nickname} setNickname={setNickname}
                          birthdate={birthdate} setBirthdate={setBirthdate}
                          gender={gender} setGender={setGender}
                          telefone={telefone} setTelefone={setTelefone}
                          passport={passport} setPassport={setPassport}
                          neighborhood={neighborhood} setNeighborhood={setNeighborhood} 
                          job={job} setJob={setJob}
                          factorRH={factorRH} setFactorRH={setFactorRH}
                          bloodType={bloodType} setBloodType={setBloodType}
                          weight={weight} setWeight={setWeight}
                          height={height} setHeight={setHeight}
                          alergia={alergia} setAlergia={setAlergia}
                          specialCondition={specialCondition} setSpecialCondition={setSpecialCondition}
                          emergencyContactName={emergencyContactName} setEmergencyContactName={setEmergencyContactName}
                          emergencyContactRelatioship={emergencyContactRelatioship} setEmergencyContactRelatioship={setEmergencyContactRelatioship}
                          emergencyContact={emergencyContact} setEmergencyContact={setEmergencyContact}
                      /> 

                      <TouchableOpacity style={styles.logupBtn} onPress={handleCreateAccount}>
                        <Text>Criar conta</Text>
                      </TouchableOpacity>

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
  },
  
  logupBtn: {
      backgroundColor: '#0DF205',
      paddingHorizontal: 130,
      textAlign: 'center',
      color: '#FFFFFF',
      paddingVertical: 13,
      borderRadius: 8,
      marginTop: 30
  }
});




