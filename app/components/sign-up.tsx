import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import InputField from './inputField';
import PasswordField from './passwordField';
import Pickery from '../picker';
import { useRouter } from "expo-router";

const SignUpComponent = () => {
    const router = useRouter();

    return (
        <>
            <TouchableOpacity onPress={() => router.push("../(auth)/medico-signup")}>
                <Text style={styles.upText}>Criar conta como médico</Text>
            </TouchableOpacity>


            <view style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Conta</Text>
            </view>
            <InputField fieldName="Email" placeholder="seu@email.com" />
            <PasswordField fieldName={'Senha'} placeholder={'password'} />
            <PasswordField fieldName={'Confirmar senha'} placeholder={'password'} />

            <view style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Dados pessoais</Text>
            </view>

            <view style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                <view style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Nome</Text>
                    <TextInput placeholder='' style={styles.input} />
                </view>
                <view style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Apelido</Text>
                    <TextInput placeholder='' style={styles.input} />
                </view>
            </view>

            <view style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                <view style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Data de nascimento</Text>
                    <TextInput placeholder='' style={styles.input} />
                </view>
                <view style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>genero</Text>
                    <Pickery width={140} selectOptions={['Masculino', 'Femenino']} />
                </view>
            </view>

            <InputField fieldName={'Telefone'} placeholder={''} />

            <InputField fieldName={'BI/Passport'} placeholder={''} />

            <InputField fieldName={'Morada'} placeholder={''} />

            <view style={styles.nameField}>
                <Text style={{ color: 'gray' }}>Profissao</Text>
                <Pickery width={300} selectOptions={['', 'Electrecista', 'Professor', 'Outro']} />
            </view>

            <view style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Dados Biológicos</Text>
            </view>

            <view style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                <view style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Factor RH</Text>
                    <TextInput placeholder='' style={styles.input} />
                </view>
                <view style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Grupo sanguinio</Text>
                    <Pickery width={140} selectOptions={['O+', 'O-', 'Outro']} />
                </view>
            </view>

            <view style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                <view style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Peso (kg)</Text>
                    <TextInput placeholder='' style={styles.input} />
                </view>
                <view style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Altura (m)</Text>
                    <TextInput placeholder='' style={styles.input}
                        keyboardType='numeric'
                    />
                </view>
            </view>

            <view style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Histórico Médico</Text>
            </view>

            <view style={styles.nameField}>
                <Text style={{ color: 'gray' }}>Alergia</Text>
                <Pickery width={300} selectOptions={['', 'Comida', 'Enlatado', 'Cosméticos', 'Medicamentos', 'Doces', 'Outro']} />
            </view>
            <view>{'-'}</view>
            <view style={styles.nameField}>
                <Text style={{ color: 'gray' }}>Condições especiais</Text>
                <Pickery width={300} selectOptions={['', 'Diabete', 'Alergia', 'Albinismo', 'Cadeirante', 'Cegueira', 'Tensão arterial']} />
            </view>

            <view style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Contacto de emergência</Text>
            </view>

            <InputField fieldName={'Nome do contacto'} placeholder={'nome'} />
            <InputField fieldName={'Relação'} placeholder={'irmão/amigo/familiar/...'} />
            <InputField fieldName={'Telefone'} placeholder={'+244 ...'} />

            <TouchableOpacity style={styles.logupBtn}>Criar conta</TouchableOpacity>
        </>
    )
}

export default SignUpComponent;

const styles = StyleSheet.create({
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