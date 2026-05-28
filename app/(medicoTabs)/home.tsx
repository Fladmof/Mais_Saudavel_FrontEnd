import { Text, ScrollView, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

const Paciente = ({name}) => {
    const router = useRouter();
    return (
        <View style={{
            display: 'flex', flexDirection: 'row',
            width: '100%', justifyContent: 'space-between', alignItems: 'center',
            padding: 10, margin: 8, borderRadius: 12
        }}>
            <Text style={{ color: 'gray' }}>{name}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => router.push("../cliente")}>
                   <Image source={require('../../assets/images/seened.png')} />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => router.push("../telemedicine/videoCallPaciente")}>
                   <Image source={require('../../assets/images/video.png')} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const PacienteAgendamento = ({name, date, status}) => {
    const router = useRouter();
    return (
        <View style={{
            display: 'flex', flexDirection: 'row',
            width: '100%', justifyContent: 'space-between', alignItems: 'center',
            padding: 10, margin: 8, borderRadius: 12
        }}>
            <Text style={{ color: 'gray' }}>{name}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                <View style={{borderWidth:1, paddingHorizontal: 10, borderRadius: 35,
                    borderColor: '#1CA625', display: 'flex',
                     alignItems: 'center', justifyContent: 'center'
                }}>
                   <Text style={{color: '#1CA625', fontSize: 14,
                    fontWeight: '400'
                   }}>07/04/2026</Text>
                </View>
                
                <TouchableOpacity onPress={() => router.push("../telemedicine/videoCallPaciente")}>
                   <View style={{borderWidth:1, paddingHorizontal: 10, borderRadius: 35,
                    borderColor: '#1CA625', paddingVertical: 4
                }}>
                   <Text style={{color: '#1CA625', fontSize: 14,
                    fontWeight: '400'
                   }}>Confirmar</Text>
                </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Home = () => {
    
    return (
        <ScrollView contentContainerStyle={{
            paddingBottom: 80
        }}>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                <View style={{
                    width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'center', paddingVertical: 10, backgroundColor: 'white',
                    borderBottomLeftRadius: 32, borderBottomEndRadius: 32
                }}>
                    <Image source={require("../../assets/images/mais-saudavel-logo.png")} />
                </View>
                <View style={{
                    display: 'flex', flexDirection: 'row', gap: 20, marginTop: 40,
                    width: '100%', backgroundColor: 'white', alignItems: 'center',
                    padding: 20, borderRadius: 32, marginBottom: 40
                }}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.nameAb}>FJ</Text>
                    </View>
                    <View>
                        <Text style={{ color: 'black', fontWeight: '500', fontSize: 16, marginBottom: 8 }}>Fortunato Francisco Joaquim</Text>
                        <Text style={{ fontSize: 14, color: '#ABB5BE' }}>Especialidade: clínico geral</Text>
                        <Text style={{ fontSize: 14, color: '#ABB5BE' }}>Clínica: Girassol</Text>
                        <Text style={{ fontSize: 14, color: '#ABB5BE' }}>N de utente: UT-00000007</Text>
                        <Text style={{ fontSize: 14, color: '#ABB5BE' }}>Tel: 956746646/956745364</Text>
                    </View>
                </View>

                <View style={{ width: '100%', backgroundColor: 'white',
                     borderRadius: 32, padding: 20 }}>
                    
                    <TouchableOpacity>
                       <PacienteAgendamento name="Manuel Andrade" />
                    </TouchableOpacity>
                    <PacienteAgendamento name="Jonathan Lemos" />
                    <PacienteAgendamento name="Miller crady" />
                    <PacienteAgendamento name="luiz dias" />
                </View>

                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{ fontSize: 18, margin: 20, color: '#1CA625', fontWeight: '500' }}>Pacientes (4)</Text>
                </View>
                <View style={{ width: '100%', backgroundColor: 'white',
                     borderRadius: 32, padding: 20 }}>
                    
                    <TouchableOpacity>
                       <Paciente name="Manuel Andrade" />
                    </TouchableOpacity>
                    <Paciente name="Jonathan Lemos" />
                    <Paciente name="Miller crady" />
                    <Paciente name="luiz dias" />
                </View>
            </View>
        </ScrollView>
    )
}
export default Home;

const styles = StyleSheet.create({
    nameContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#20F6591A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nameAb: {
        color: '#1CA625',
        fontWeight: '500',
        fontSize: 18
    },
})