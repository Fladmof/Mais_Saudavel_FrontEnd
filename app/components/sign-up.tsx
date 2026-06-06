import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import InputField from './inputField';
import PasswordField from './passwordField';
import Pickery from '../picker';
import { useRouter } from "expo-router";
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const SignUpComponent = () => {
    const router = useRouter();
    const { loading, error, handleRegister, setError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordcheck, setPasswordcheck] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [gender, setGender] = useState('');
    const [telefone, setTelefone] = useState('');
    const [passport, setPassport] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [job, setJob] = useState('');
    const [factorRH, setFactorRH] = useState('');
    const [bloodType, setBloodType] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [alergia, setAlergia] = useState('');
    const [specialCondition, setSpecialCondition] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactRelatioship, setEmergencyContactRelatioship] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [showPass3, setShowPass3] = useState(false);
    const [showPass4, setShowPass4] = useState(false);

    const validateForm = () => {
        if (!email || !password || !passwordcheck || !name || !gender || !telefone || !passport || !neighborhood) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
            return false;
        }
        if (password !== passwordcheck) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return false;
        }
        if (password.length < 8) {
            Alert.alert('Erro', 'Senha deve ter pelo menos 8 caracteres');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        setError(null);

        if (!validateForm()) return;

        const userData = {
            role: 'utente',
            email,
            nome: name,
            password,
            telefone,
            datanascimento: birthdate,
            genero: gender,
            bi: passport,
            morada: neighborhood,
            gsanguineo: bloodType,
            factorrh: factorRH,
            peso: weight,
            altura: height,
            alergia,
            condespeciais: specialCondition,
            relacao: emergencyContactRelatioship,
            telemergencia: emergencyContact
        };

        const result = await handleRegister(userData);

        if (result.success) {
            Alert.alert('Sucesso', 'Conta criada com sucesso!', [
                { text: 'OK', onPress: () => router.push('/(tabs)/ficha-medica') }
            ]);
        } else {
            Alert.alert('Erro', result.error?.message || 'Erro ao criar conta');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {error && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <TouchableOpacity onPress={() => router.push("../(auth)/medico-signup")}>
                <Text style={styles.upText}>Criar conta como médico</Text>
            </TouchableOpacity>

            <View style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Conta</Text>
            </View>
            <InputField fieldName="Email" placeholder="seu@email.com" value={email} setValue={setEmail}/>
            <PasswordField fieldName="Senha" placeholder="password" value={password} setValue={setPassword}
                securityTextEntry={showPass3}
                onToggleSecure={() => setShowPass3(!showPass3)}
            />
            <PasswordField fieldName="Confirmar senha" placeholder="password" value={passwordcheck} setValue={setPasswordcheck}
                securityTextEntry={showPass4}
                onToggleSecure={() => setShowPass4(!showPass4)}
            />

            <View style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Dados pessoais</Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                <View style={styles.nameField}>
                    <Text style={{color: 'gray'}}>Nome</Text>
                    <TextInput placeholder='' style={styles.input} value={name} onChangeText={setName}/>
                </View>
                <View style={styles.nameField}>
                    <Text style={{color: 'gray'}}>Apelido</Text>
                    <TextInput placeholder='' style={styles.input} value={nickname} onChangeText={setNickname}/>
                </View>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                <View style={styles.nameField}>
                    <Text style={{color: 'gray'}}>Data de nascimento</Text>
                    <TextInput placeholder='YYYY-MM-DD' style={styles.input} value={birthdate} onChangeText={setBirthdate}/>
                </View>
                <View style={styles.nameField}>
                    <Text style={{color: 'gray'}}>Gênero</Text>
                    <Pickery width={140} selectOptions={['Masculino', 'Feminino']} value={gender} setValue={setGender}/>
                </View>
            </View>

            <InputField fieldName="Telefone" placeholder="+244 ..." value={telefone} setValue={setTelefone}/>
            <InputField fieldName="BI/Passport" placeholder="" value={passport} setValue={setPassport}/>
            <InputField fieldName="Morada" placeholder="" value={neighborhood} setValue={setNeighborhood}/>

            <View style={styles.nameField}>
                <Text style={{ color: 'gray' }}>Profissão</Text>
                <Pickery width={300} selectOptions={['', 'Eletricista', 'Professor', 'Outro']} value={job} setValue={setJob}/>
            </View>

            <View style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Dados Biológicos</Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                <View style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Factor RH</Text>
                    <TextInput placeholder="" style={styles.input} value={factorRH} onChangeText={setFactorRH}/>
                </View>
                <View style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Grupo sanguíneo</Text>
                    <Pickery width={140} selectOptions={['O+', 'O-', 'Outro']} value={bloodType} setValue={setBloodType}/>
                </View>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                <View style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Peso (kg)</Text>
                    <TextInput placeholder="" style={styles.input} keyboardType="numeric" value={weight} onChangeText={setWeight}/>
                </View>
                <View style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Altura (m)</Text>
                    <TextInput placeholder="1.75" style={styles.input} keyboardType="decimal-pad" value={height} onChangeText={setHeight}/>
                </View>
            </View>

            <View style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Histórico Médico</Text>
            </View>

            <View style={styles.nameField}>
                <Text style={{ color: 'gray' }}>Alergia</Text>
                <Pickery width={300} selectOptions={['', 'Comida', 'Enlatado', 'Cosméticos', 'Medicamentos', 'Doces', 'Outro']} value={alergia} setValue={setAlergia}/>
            </View>

            <View style={styles.nameField}>
                <Text style={{ color: 'gray' }}>Condições especiais</Text>
                <Pickery width={300} selectOptions={['', 'Diabete', 'Alergia', 'Albinismo', 'Cadeirante', 'Cegueira', 'Tensão arterial']} value={specialCondition} setValue={setSpecialCondition}/>
            </View>

            <View style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Contacto de emergência</Text>
            </View>

            <InputField fieldName="Nome do contacto" placeholder="nome" value={emergencyContactName} setValue={setEmergencyContactName}/>
            <InputField fieldName="Relação" placeholder="irmão/amigo/familiar" value={emergencyContactRelatioship} setValue={setEmergencyContactRelatioship}/>
            <InputField fieldName="Telefone" placeholder="+244 ..." value={emergencyContact} setValue={setEmergencyContact}/>

            <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Registrar</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
};

export default SignUpComponent;

const styles = StyleSheet.create({
    container: {
        paddingBottom: 30
    },
    errorBox: {
        backgroundColor: '#ffebee',
        borderLeftWidth: 4,
        borderLeftColor: '#d32f2f',
        padding: 12,
        marginHorizontal: 12,
        marginVertical: 10,
        borderRadius: 4
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 14
    },
    upText: {
        color: '#2b9128',
        marginBottom: 30,
        fontWeight: '500',
        textAlign: 'center'
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
    submitButton: {
        backgroundColor: '#2b9128',
        padding: 14,
        borderRadius: 8,
        marginHorizontal: 12,
        marginTop: 20,
        alignItems: 'center'
    },
    submitButtonDisabled: {
        opacity: 0.6
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});