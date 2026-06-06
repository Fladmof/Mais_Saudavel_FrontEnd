import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import InputField from './inputField';
import { useRouter } from "expo-router";
import { useState } from 'react';

// VERIFIQUE SE O CAMINHO ESTÁ CORRETO
import authService from '../../services/authService';

const Login = () => {
    const router = useRouter();
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) return "O email é obrigatório";
        if (!trimmedEmail.includes("@")) return "Email inválido";
        if (!password) return "A senha é obrigatória";
        return null;
    }

    const handleLogin = async () => {
        try {
            const error = validateForm();
            if (error) {
                Alert.alert("Erro", error);
                return;
            }

            setLoading(true);
            
            // DEBUG - verificar se o serviço existe
            if (!authService || typeof authService.login !== 'function') {
                throw new Error("Serviço de autenticação não configurado");
            }
            
            const resposta = await authService.login(email.trim(), password);
            
            // DEBUG - ver o que está retornando
            console.log('Resposta do login:', JSON.stringify(resposta, null, 2));
            
            if (!resposta) {
                throw new Error("Servidor não respondeu");
            }
            
            if (resposta.sucesso) {
                Alert.alert("Sucesso", "Login realizado com sucesso!");
                
                // Verificar se user existe
                if (!resposta.user || !resposta.user.role) {
                    throw new Error("Dados do usuário incompletos");
                }
                
                // Navegação baseada no role
                switch(resposta.user.role) {
                    case "medico":
                        router.replace("/(medicoTabs)/home");
                        break;
                    case "utente":
                        router.replace("/(utenteTabs)/ficha-medica");
                        break;
                    case "admin":
                        router.replace("/admin");
                        break;
                    default:
                        throw new Error(`Role desconhecido: ${resposta.user.role}`);
                }
            } else {
                Alert.alert("Erro", resposta.mensagem || "Falha no login");
            }
        } catch (error) {
            console.error('Erro completo:', error);
            Alert.alert(
                "Erro no login",
                error?.response?.data?.message || error.message || "Tente novamente mais tarde"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <InputField fieldName="Email" placeholder="seu@email.com" value={email} setValue={setEmail}/>
            
            <View style={[{ marginTop: 18 }, styles.inputField]}>
                <View style={styles.inputField}>
                    <Text style={{ color: 'grey' }}>Senha</Text>
                    <View style={[styles.inputeye, styles.input]}>
                        <TextInput
                            placeholder="palavra-passe"
                            style={{ flex: 1, padding: 4 }}
                            placeholderTextColor={'#B9C0C9'}
                            secureTextEntry={!showPass}
                            value={password}
                            onChangeText={setPassword}
                            editable={!loading}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            <Text style={{ color: '#6B6B6B', fontWeight: '500' }}>
                                {showPass ? 'Ocultar' : 'Mostrar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{ marginTop: 18 }}>
                <TouchableOpacity onPress={() => router.push('/register')}>
                    <Text style={styles.noCountText}>
                        Não tem conta?
                        <Text style={{ color: 'blue' }}> criar</Text>
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.loginBtn, loading && styles.disabledBtn]} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text>Entrar</Text>}
            </TouchableOpacity>

            <View style={{ marginTop: 16 }}>
                <Image source={require('../../assets/images/or.png')} />
            </View>
             
            <TouchableOpacity style={[styles.googleBtn, loading && styles.disabledBtn]} onPress={handleLogin} disabled={loading}>
                <Image style={{ margin: 5 }} source={require('../../assets/images/google.png')} />
                <Text style={styles.googleText}>Entrar com Google</Text>
            </TouchableOpacity>
        </>
    )
}


export default Login;

const styles = StyleSheet.create({
    inputField: {
        display: 'flex',
        flexDirection: 'column'
    },
    input: {
        flex: 1,
        width: 300,
        borderWidth: 1,
        borderColor: '#EDF1F3',
        padding: 10,
        borderRadius: 8,
    },
    inputeye: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    loginBtn: {
        backgroundColor: '#0DF205',
        paddingHorizontal: 130,
        textAlign: 'center',
        color: '#FFFFFF',
        paddingVertical: 13,
        borderRadius: 8,
        marginTop: 30
    },
    googleBtn: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 18,
        borderWidth: 1,
        paddingHorizontal: 70,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        borderColor: 'lightgray'
    },
    googleText: {
        color: 'gray'
    },
    noCountText: {
        color: 'gray',
        fontWeight: '400'
    }
    ,
    disabledBtn: {
        opacity: 0.6
    }

});