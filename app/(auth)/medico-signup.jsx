import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import InputField from '../components/inputField';
import PasswordField from "../components/passwordField";

export default function SignUp() {
    const router = useRouter();
    const [tab, setTab] = useState('criar');

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


                    <View style={styles.sectionInput}>
                        <Text style={styles.sectionTitle}>Conta</Text>
                    </View>
                    <InputField fieldName="Email" placeholder="seu@email.com" />
                    <PasswordField fieldName={'Senha'} placeholder={'password'} />
                    <PasswordField fieldName={'Confirmar senha'} placeholder={'password'} />

                    <View style={styles.sectionInput}>
                        <Text style={styles.sectionTitle}>Dados pessoais</Text>
                    </View>

                    <View style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                        <View style={styles.nameField}>
                            <Text style={{ color: 'gray' }}>Nome</Text>
                            <TextInput placeholder='' style={styles.input} />
                        </View>
                        <View style={styles.nameField}>
                            <Text style={{ color: 'gray' }}>Apelido</Text>
                            <TextInput placeholder='' style={styles.input} />
                        </View>
                    </View>

                    <View style={styles.sectionInput}>
                        <Text style={styles.sectionTitle}>Dados Profissionais</Text>
                    </View>
                    <InputField fieldName="" placeholder="Especialidade" />
                    <InputField fieldName="" placeholder="Hospital" />



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




