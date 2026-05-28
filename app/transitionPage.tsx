import { StyleSheet, Text, ScrollView, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const TransitionPage = () => {
    const router = useRouter();

    return (
        <ScrollView>
            <View style={styles.container}>
                <Image source={require("../assets/images/mais-saudavel-logo.png")} />
                <Text style={styles.firstText}>+20 especialidades registradas {"\n"} no +saudável</Text>

                <Text style={styles.secondText}>Registre, acompanhe e partilhe os {"\n"} 
                    seus dados clínicos com segurança e {"\n"} 
                    total controlo
                </Text>

                <View style={{display: 'flex', flexDirection: 'row', gap: 12, marginTop: 20}}>
                    <Image source={require('../assets/images/historico.png')}/>
                    <Image source={require('../assets/images/monitoramento.png')}/>
                </View>

                <View style={{display: 'flex', flexDirection: 'row', gap: 12, marginTop: 20}}>
                    <Image source={require('../assets/images/transporte.png')}/>
                    <Image source={require('../assets/images/teleconsulta.png')}/>
                </View>

                <Text style={styles.thirdText}>Mais qualidade de vida!</Text>

                <Text style={styles.fourthText}>O +Saudável simplifica o acompanhamento diário {"\n"}
                    e devolve autonomia ao paciente e a familia. {"\n"}
                    Cuidar da saúde nunca foi fácil
                </Text>

                <Text style={styles.fithText}>
                    Com O +Saudável é tudo mais prático
                </Text>

                <View>
                    <Image source={require('../assets/images/healthcare.png')} />
                </View>

                <Text style={styles.sixthText}>Onde a saúde encontra a atenção que {'\n'} merece!</Text>

                <View style={styles.commentContainer}>
                    <Image source={require('../assets/images/Button.png')}/>
                    <Text style={styles.secondText}>O +Saudável simplifica o acompanhamento diário {"\n"}
                        e devolve a autonomia ao paciente e a família. {"\n"}
                        Cuidar da saúde nunca foi fácil
                    </Text>

                    <Image style={{margin: 10}}source={require('../assets/images/doctor.png')}/>

                    <Text style={{fontWeight: '500', color: 'gray', marginTop: 10}}>Fortunato Joaquim</Text>
                    <Text>Médico clínico geral</Text>
                </View>
                
                <Text style={styles.seventhText}>
                    Aproveite 1 mês de uso gratuito {'\n'}
                    com acompanhamento e consulta {'\n'}
                    de clínico geral
                </Text>
                
                <TouchableOpacity style={{marginTop: 60}}
                onPress={() => router.push("/(tabs)/ficha-medica")}>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#1CA625', justifyContent: 'space-between', paddingHorizontal: 60, borderRadius: 16, paddingVertical: 0}}>
                     <View></View>  <Text style={{fontWeight: '500', color: 'white'}}>Continuar</Text> <Image style={{marginRight: -70, marginVertical: -10}} source={require('../assets/images/arrow.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default TransitionPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    firstText: {
        color: '#1CA625',
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center'
    },
    secondText: {
        color: 'gray',
        textAlign: 'center',
        marginTop: 20
    },
    thirdText: {
        color: '#1CA625',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 30
    },
    fourthText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 20
    },

    fithText: {
        color: 'black',
        marginTop: 10,
        marginBottom: 40
    },
    sixthText: {
        textAlign: 'center',
        color: 'gray',
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 40
    },
    seventhText: {
        color: '#1CA625',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 80
    },
    commentContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: '#20F6591A',
        borderWidth: 1,
        width:'100%',
        borderRadius: 15
    }
})