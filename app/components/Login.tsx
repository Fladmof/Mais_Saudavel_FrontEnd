import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import InputField from './inputField';
import { useRouter } from "expo-router";

const Login = () => {
    const router = useRouter();

    return (
        <>
            <InputField fieldName="Email" placeholder="seu@email.com"/>

            <View style={[{ marginTop: 18 }, styles.inputField]}>
                <view style={styles.inputField}>
                    <Text style={{ color: 'grey' }}>Senha</Text>
                    <View style={[styles.inputeye, styles.input]}>
                        <TextInput
                            placeholder="palavra-passe"
                            style={{ flex: 1, padding: 4 }}
                            placeholderTextColor={'#B9C0C9'}
                            secureTextEntry
                        />
                        <view>
                            <TouchableOpacity>
                                <Image source={require('../../assets/images/eye-off.png')} />
                            </TouchableOpacity>
                        </view>
                    </View>
                </view>
            </View>

            <View style={{ marginTop: 18 }}>
                <Text style={styles.noCountText}>
                    Não tem conta?
                    <Text style={{ color: 'blue' }}> criar</Text>
                </Text>
            </View>

            <TouchableOpacity style={styles.loginBtn} 
            onPress={() => router.push("/ficha-medica")}>Entrar</TouchableOpacity>

            <View style={{ marginTop: 16 }}>
                <Image source={require('../../assets/images/or.png')} />
            </View>

            <TouchableOpacity style={styles.googleBtn} onPress={() => router.push("/transitionPage")}>
                <Image style={{ margin: 5 }} source={require('../../assets/images/google.png')} />
                <Text style={styles.googleText}>Entrar com Google </Text>
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

});