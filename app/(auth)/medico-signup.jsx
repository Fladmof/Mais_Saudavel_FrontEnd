import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import InputField from '../components/inputField';
import Pickery from '../picker';
import PasswordField from "../components/passwordField";
import axios from 'axios';

export default function SignUp() {
    const router = useRouter();
    const [tab, setTab] = useState('criar');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordcheck, setPasswordcheck] = useState("");
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [especialidade, setEspecialidade] = useState("");
    const [hospital, setHospital] = useState("");
    const [loading, setLoading] = useState(false);

    const [showPass1, setShowPass1] = useState(false);
    const [showPass2, setShowPass2] = useState(false);

    // Configuração da URL base da sua API
    const API_BASE_URL = 'http://172.20.10.13:3000' || 'http://10.0.2.2:3000';

    const validateForm = () => {
        if (!email.trim()) {
            return "O email é obrigatório";
        }
        if (!email.includes("@")) {
            return "Email inválido";
        }
        if (!password) {
            return "A senha é obrigatória";
        }
        if (password.length < 6) {
            return "A senha deve ter pelo menos 6 caracteres";
        }
        if (password !== passwordcheck) {
            return "As senhas não coincidem";
        }
        if (!name.trim()) {
            return "O nome é obrigatório";
        }
        if (!nickname.trim()) {
            return "O apelido é obrigatório";
        }
        if (!especialidade.trim()) {
            return "Informe a especialidade";
        }
        if (!hospital.trim()) {
            return "Selecione o hospital";
        }

        return null;
    }

    const handleCreateAccount = async () => {
    try {
        const error = validateForm();

        if (error) {
            Alert.alert("Erro de validação", error);
            return;
        }

        setLoading(true);
        let nome = name.trim() + " " + nickname.trim(); // Adicionei espaço entre nome e apelido
        const payload = {
            email: email.trim(),
            password: password,
            nome: nome,
            especialidade: especialidade.trim(),
            hospital: hospital.trim()
        };

        console.log("Enviando payload:", payload);

        // ESCOLHA UMA DAS DUAS OPÇÕES ABAIXO:

        // OPÇÃO 1: Usando axios (recomendado)
        const resposta = await axios({
            method: 'post',
            url: `${API_BASE_URL}/medicos/register`,
            data: payload,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });

        console.log("Resposta do backend:", resposta.data);

        if (resposta.status === 200 || resposta.status === 201) {
            Alert.alert(
                "Sucesso", 
                "Conta criada com sucesso!",
                [
                    {
                        text: "OK",
                        onPress: () => router.push("../(medicoTabs)/home")
                    }
                ]
            );
        } else {
            Alert.alert("Erro", resposta.data.message || "Erro ao criar conta");
        }

        /* 
        // OPÇÃO 2: Usando fetch (alternativa)
        const resposta = await fetch(`${API_BASE_URL}/medicos/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const dados = await resposta.json();

        if (resposta.status === 200 || resposta.status === 201) {
            Alert.alert(
                "Sucesso", 
                "Conta criada com sucesso!",
                [
                    {
                        text: "OK",
                        onPress: () => router.push("../(medicoTabs)/home")
                    }
                ]
            );
        } else {
            Alert.alert("Erro", dados.message || "Erro ao criar conta");
        }
        */

    } catch (error) {
        console.log("Erro completo:", error);
        
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.log("Resposta de erro:", error.response.data);
                Alert.alert(
                    "Erro no servidor", 
                    error.response.data.message || "Erro ao processar requisição"
                );
            } else if (error.request) {
                console.log("Sem resposta do servidor");
                Alert.alert(
                    "Erro de conexão", 
                    "Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde."
                );
            } else {
                Alert.alert("Erro", error.message);
            }
        } else {
            Alert.alert("Erro", "Ocorreu um erro inesperado");
        }
    } finally {
        setLoading(false);
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

                <>
                    <TouchableOpacity onPress={() => router.push("./sign-up")}>
                        <Text style={styles.upText}>Criar conta como paciente</Text>
                    </TouchableOpacity>

                    <View style={styles.sectionInput}>
                        <Text style={styles.sectionTitle}>Conta</Text>
                    </View>
                    
                    <InputField fieldName="Email" placeholder="seu@email.com" value={email} setValue={setEmail} />
                    
                    <PasswordField 
                        fieldName={'Senha'} 
                        placeholder={'password'} 
                        value={password} 
                        setValue={setPassword} 
                        securityTextEntry={showPass1} 
                        onToggleSecure={() => setShowPass1(!showPass1)}
                    />

                    <PasswordField 
                        fieldName={'Confirmar senha'} 
                        placeholder={'password'} 
                        value={passwordcheck} 
                        setValue={setPasswordcheck} 
                        securityTextEntry={showPass2} 
                        onToggleSecure={() => setShowPass2(!showPass2)}
                    />

                    <View style={styles.sectionInput}>
                        <Text style={styles.sectionTitle}>Dados pessoais</Text>
                    </View>

                    <View style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                        <View style={styles.nameField}>
                            <Text style={{ color: 'gray' }}>Nome</Text>
                            <TextInput placeholder='' style={styles.input} value={name} onChangeText={setName} />
                        </View>
                        <View style={styles.nameField}>
                            <Text style={{ color: 'gray' }}>Apelido</Text>
                            <TextInput placeholder='' style={styles.input} value={nickname} onChangeText={setNickname} />
                        </View>
                    </View>

                    <View style={styles.sectionInput}>
                        <Text style={styles.sectionTitle}>Dados Profissionais</Text>
                    </View>
                    
                    <InputField fieldName="" placeholder="Especialidade" value={especialidade} setValue={setEspecialidade} />
                    <InputField fieldName="" placeholder="Hospital" value={hospital} setValue={setHospital} />

                    <TouchableOpacity 
                        style={[styles.logupBtn, loading && styles.disabledBtn]}
                        onPress={handleCreateAccount} 
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.btnText}>Criar conta</Text>
                        )}
                    </TouchableOpacity>
                </>
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
    upText: {
        color: '#2b9128',
        marginBottom: 30,
        fontWeight: '500'
    },
    sectionInput: {
        margin: 16
    },
    sectionTitle: {
        color: 'green',
        fontWeight: '500'
    },
    nameField: {
        display: 'flex',
        flexDirection: 'column',
        marginVertical: 10
    },
    input: {
        flex: 1,
        width: 140,
        borderWidth: 1,
        borderColor: '#EDF1F3',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 6
    },
    logupBtn: {
        backgroundColor: '#0DF205',
        paddingHorizontal: 130,
        paddingVertical: 13,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center'
    },
    disabledBtn: {
        backgroundColor: '#8BC34A',
        opacity: 0.7
    },
    btnText: {
        color: '#FFFFFF',
        fontWeight: '600'
    }
});


/* import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, TurboModuleRegistry, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import InputField from '../components/inputField';
import Pickery from '../picker';
import PasswordField from "../components/passwordField";


export default function SignUp() {
    const router = useRouter();
    const [tab, setTab] = useState('criar');
    const [hidePassword, setHidePassword] = false;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordcheck, setPasswordcheck] = useState("");
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [especialidade, setEspecialidade] = useState("");
    const [hospital, setHospital] = useState("");

    const [showPass1, setShowPass1] = useState(false);
    const [showPass2, setShowPass2] = useState(false);

    const validateForm = () => {
        if (!email.trim()) {
            return "O email é obrigatorio"
        }
        if (!email.includes("@")) {
            return "Email inválido"
        }
        if (!password) {
            return "A senha é obrigatoria"
        }
        if (password.length < 6) {
            return "A senha deve ter pelo menos 6 caracteres"
        }
        if (password !== passwordcheck) {
            return "As senhas não coincidem"
        }
        if (!name.trim()) {
            return "O nome é obrigatorio"
        }
        if (!nickname.trim()) {
            return "O sobrenome é obrigatorio"
        }
        if (!especialidade.trim()) {
            return "Informe a especialidade"
        }
        if (!hospital.trim()) {
            return "Selecione o hospital"
        }

        return null;
    }

    const handleCreateAccount = () => {
        try {

            const error = validateForm();

            if (error) {
                Alert.alert(error);
                return;
            }

            const payLoad = {
                email: email.trim(),
                password,
                name: name.trim(),
                nickname: nickname.trim(),
                especialidade: especialidadetrim(),
                hospital: hospital.trim()
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

                <>
                    <TouchableOpacity onPress={() => router.push("./sign-up")}>
                        <Text style={styles.upText}>Criar conta como paciente</Text>
                    </TouchableOpacity>

                    <view style={styles.sectionInput}>
                        <Text style={styles.sectionTitle}>Conta</Text>
                    </view>
                    <InputField fieldName="Email" placeholder="seu@email.com" value={email} setValue={setEmail} />
                    <PasswordField fieldName={'Senha'} placeholder={'password'} value={password} setValue={setPassword} 
                    securityTextEntry={showPass1} 
                    onToggleSecure={() => setShowPass1(!showPass1)}/>

                    <PasswordField fieldName={'Confirmar senha'} placeholder={'password'} 
                    value={passwordcheck} setValue={setPasswordcheck} 
                    securityTextEntry={showPass2} 
                    onToggleSecure={() => setShowPass2(!showPass2)}/>

                    <view style={styles.sectionInput}>
                        <Text style={styles.sectionTitle}>Dados pessoais</Text>
                    </view>

                    <view style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                        <view style={styles.nameField}>
                            <Text style={{ color: 'gray' }}>Nome</Text>
                            <TextInput placeholder='' style={styles.input} value={name} onChangeText={setName} />
                        </view>
                        <view style={styles.nameField}>
                            <Text style={{ color: 'gray' }}>Apelido</Text>
                            <TextInput placeholder='' style={styles.input} value={nickname} onChangeText={setNickname} />
                        </view>
                    </view>

                    <view style={styles.sectionInput}>
                        <Text style={styles.sectionTitle}>Dados Profissionais</Text>
                    </view>
                    <InputField fieldName="" placeholder="Especialidade" value={especialidade} setValue={setEspecialidade} />
                    <InputField fieldName="" placeholder="Hospital" value={hospital} setValue={setHospital} />



                    <TouchableOpacity style={styles.logupBtn}
                        onPress={() => router.push("../(medicoTabs)/home")}>
                        Criar conta
                    </TouchableOpacity>
                </>


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


    upText: {
        color: '#2b9128',
        marginBottom: 30,
        fontWeight: '500'
    },
    sectionInput: {
        margin: 16
    },
    sectionTitle: {
        color: 'green',
        fontWeight: '500'
    },
    nameField: {
        display: 'flex',
        flexDirection: 'column',
        marginVertical: 10
    },
    input: {
        flex: 1,
        width: 140,
        borderWidth: 1,
        borderColor: '#EDF1F3',
        padding: 10,
        borderRadius: 8,
        marginHorizontal: 6
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




 */