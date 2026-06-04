import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import InputField from './inputField';
import PasswordField from './passwordField';
import Pickery from '../picker';
import { useRouter } from "expo-router";
import { useState } from 'react';

const SignUpComponent = ({email, setEmail, password, setPassword, passwordcheck,
    setPasswordcheck, name, setName, nickname, setNickname, birthdate, setBirthdate,
    gender, setGender, telefone, setTelefone, passport, setPassport, neighborhood, 
    setNeighborhood, job, setJob, factorRH, setFactorRH, bloodType, setBloodType,
    weight, setWeight, height, setHeight, alergia, setAlergia, specialCondition, 
    setSpecialCondition, emergencyContactName, setEmergencyContactName, emergencyContactRelatioship,
    setEmergencyContactRelatioship, emergencyContact, setEmergencyContact
}) => {
    const router = useRouter();
    const [showPass3, setShowPass3] = useState(false);
    const [showPass4, setShowPass4] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={() => router.push("../(auth)/medico-signup")}>
                <Text style={styles.upText}>Criar conta como médico</Text>
            </TouchableOpacity>

            <View style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Conta</Text>
            </View>
            <InputField fieldName="Email" placeholder="seu@email.com" value={email} setValue={setEmail}/>
            <PasswordField fieldName={'Senha'} placeholder={'password'} value={password} setValue={setPassword}
            securityTextEntry={showPass3} 
                    onToggleSecure={() => setShowPass3(!showPass3)}/>

            <PasswordField fieldName={'Confirmar senha'} placeholder={'password'} value={passwordcheck} setValue={setPasswordcheck}
            securityTextEntry={showPass4} 
                    onToggleSecure={() => setShowPass4(!showPass4)}/>

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
                    <TextInput placeholder='' style={styles.input} value={birthdate} onChangeText={setBirthdate}/>
                </View>
                <View style={styles.nameField}>
                    <Text style={{color: 'gray'}}>genero</Text>
                    <Pickery width={140} selectOptions={['Masculino', 'Femenino']} value={gender} setValue={setGender}/>
                </View>
            </View>

            <InputField fieldName={'Telefone'} placeholder={''} value={telefone} setValue={setTelefone}/>

            <InputField fieldName={'BI/Passport'} placeholder={''} value={passport} setValue={setPassport}/>

            <InputField fieldName={'Morada'} placeholder={''} value={neighborhood} setValue={setNeighborhood}/>

            <View style={styles.nameField}>
                <Text style={{ color: 'gray' }}>Profissao</Text>
                <Pickery width={300} selectOptions={['', 'Electrecista', 'Professor', 'Outro']} value={job} setValue={setJob}/>
            </View>

            <View style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Dados Biológicos</Text>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                <View style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Factor RH</Text>
                    <TextInput placeholder='' style={styles.input} value={factorRH} onChangeText={setFactorRH}/>
                </View>
                <View style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Grupo sanguinio</Text>
                    <Pickery width={140} selectOptions={['O+', 'O-', 'Outro']} value={bloodType} setValue={setBloodType}/>
                </View>
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', margin: 12 }}>
                <View style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Peso (kg)</Text>
                    <TextInput placeholder='' style={styles.input} value={weight} onChangeText={setWeight}/>
                </View>
                <View style={styles.nameField}>
                    <Text style={{ color: 'gray' }}>Altura (m)</Text>
                    <TextInput placeholder='' style={styles.input}
                        keyboardType='numeric' value={height} onChangeText={setHeight}
                    />
                </View>
            </View>

            <View style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Histórico Médico</Text>
            </View>

            <View style={styles.nameField}>
                <Text style={{ color: 'gray' }}>Alergia</Text>
                <Pickery width={300} selectOptions={['', 'Comida', 'Enlatado', 'Cosméticos', 'Medicamentos', 'Doces', 'Outro']} 
                value={alergia} setValue={setAlergia}/>
            </View>
            <View style={{margin: 8}}>{' '}</View>
            <View style={styles.nameField}>
                <Text style={{color: 'gray'}}>Condições especiais</Text>
                <Pickery width={300} selectOptions={['', 'Diabete', 'Alergia', 'Albinismo', 'Cadeirante', 'Cegueira', 'Tensão arterial']} 
                value={specialCondition} setValue={setSpecialCondition}/>
            </View>

            <View style={styles.sectionInput}>
                <Text style={styles.sectionTitle}>Contacto de emergência</Text>
            </View>

            <InputField fieldName={'Nome do contacto'} placeholder={'nome'} value={emergencyContactName} setValue={setEmergencyContactName}/>
            <InputField fieldName={'Relação'} placeholder={'irmão/amigo/familiar/...'} value={emergencyContactRelatioship} setValue={setEmergencyContactRelatioship}/>
            <InputField fieldName={'Telefone'} placeholder={'+244 ...'} value={emergencyContact} setValue={setEmergencyContact}/>

            
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
});