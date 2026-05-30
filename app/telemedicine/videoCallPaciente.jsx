import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";

const PacienteMessage = ({message}) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{
                backgroundColor: '#20F6591A', width: 40, height: 40, borderRadius: '50%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
            }}>
                <Text>PA</Text>
            </View>
            <View style={{
                backgroundColor: '#20F6591A', paddingVertical: 10,
                borderBottomEndRadius: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20,
                paddingHorizontal: 20
            }}>
                <Text style={{color: ''}}>{message}</Text>
            </View>
        </View>
    )
}

const DoctorMessage = ({message}) => {
    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignSelf: 'flex-end', gap: 10 }}>
            <View style={{
                backgroundColor: '#0DF205', paddingVertical: 10,
                borderBottomEndRadius: 0, borderTopRightRadius: 20, borderTopLeftRadius: 20,
                borderBottomStartRadius: 20,
                paddingHorizontal: 20
            }}>
                <Text style={{ color: 'white' }}>{message}</Text>
            </View>
            <View style={{
                backgroundColor: '#0DF205', width: 40, height: 40, borderRadius: '50%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
            }}>
                <Text>MC</Text>
            </View>
        </View>
    )
}
const PacienteTelMedicin = () => {
    const router = useRouter();

    return (
        <ScrollView>
            <View>
                <View style={styles.header}>
                    <Text style={styles.fichaText}>Telemedicina</Text>
                    <View style={styles.securityContainer}>
                        <Image source={require('../../assets/images/security.png')} />
                        <Text style={{ fontWeight: '400', color: 'white' }}>Segurança da informação</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => router.push("../(medicoTabs)/home")}>
                    <Image source={require('../../assets/images/Left.png')} />
                </TouchableOpacity>

                <View style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <View>
                        <View style={{ width: '98%', position: 'absolute', zIndex: 100, marginTop: 20, dsiplay: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{
                                marginLeft: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, borderWidth: 1, borderColor: '#B6B6B6', paddingHorizontal: 8,
                                borderRadius: 12, paddingVertical: 2
                            }}>
                                <Image source={require('../../assets/images/redDot.png')} />
                                <Text style={{ color: '#808080', fontSize: 12, fontWeight: '400' }}>
                                    09:12
                                </Text>
                            </View>
                            <TouchableOpacity>
                                <Image source={require('../../assets/images/hide.png')} />
                            </TouchableOpacity>
                        </View>
                        <Image source={require('../../assets/images/costumer.png')} style={{ width: 400, height: 300 }} />
                        <View style={{ position: 'absolute', bottom: 12, right: 12 }}>
                            <Image style={{ width: 90, height: 90, borderRadius: 20 }} source={require('../../assets/images/medico.png')} />
                        </View>
                    </View>
                </View>
                <View style={{
                    display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center',
                    gap: 20, marginTop: 20
                }}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/images/Voice.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require('../../assets/images/close.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require('../../assets/images/Camera.png')} />
                    </TouchableOpacity>
                </View>

                <View style={{
                    display: 'flex', flexDiretion: 'column', width: 450, backgroundColor: 'white',
                    gap: 20, paddingVertical: 30, borderRadius: 32, paddingHorizontal: 20, borderWidth: 1,
                    borderColor: 'lightgreen', marginTop: 40, alignSelf: 'center'
                }}>
                    <View style={{alignSelf: 'center', marginTop: -54}}>
                        <Text style={{color: 'gray', fontWeight: '500'}}>10 min</Text>
                   </View>
                    <PacienteMessage message={'vou tomar este remédio'} id='ufhuuf'/>
                    <DoctorMessage message={'sim este mesmo'} id='ufhu98684f'/>
                    <PacienteMessage message={'tomando mesmo agora'} id='ufeh65555uuf'/>
                </View>

                <View style={{
                    backgroundColor: 'white', marginVertical: 40, paddingBottom: 30,
                    borderColor: "#20F6591A", borderWidth: 1, borderRadius: 32, paddingTop: 40
                }}>
                    <Text style={{
                        color: '#6C7278', fontWeight: '500', fontSize: 12,
                        marginHorizontal: 20, marginBottom: 12
                    }}>
                        Descrição
                    </Text>
                    <View style={{
                        gap: 16, display: 'flex', flexDirection: 'row', alignItems: 'center',

                    }}>
                        <TextInput placeholder='Adicione mais informações pa...' style={{
                            width: '70%', borderWidth: 1, marginLeft: 20,
                            borderRadius: 10,
                            borderColor: "#20F6591A", height: 70, paddingHorizontal: 10
                        }}
                            placeholderTextColor="#B9C0C9" />
                        <TouchableOpacity>
                            <Image source={require('../../assets/images/Send.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default PacienteTelMedicin;

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 14,
        borderBottomEndRadius: 16,
        borderBottomStartRadius: 16,
        backgroundColor: 'white',
        borderColor: "#20F6591A",
        borderWidth: 1
    },
    fichaText: {
        color: '#1CA625',
        fontSize: 22,
        fontWeight: '500',
        marginTop: 10
    },
    securityContainer: {
        backgroundColor: '#1CA625',
        display: 'flex',
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 5,
        borderRadius: 12,
        marginTop: 14,
        alignItems: 'center'
    }
})