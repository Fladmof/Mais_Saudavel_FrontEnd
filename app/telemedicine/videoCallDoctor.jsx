import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";

const DoctorTelMedicin = () => {
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

                <TouchableOpacity onPress={() => router.push("../(tabs)/medication")}>
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
                        <Image source={require('../../assets/images/medico.png')} />
                        <View style={{ position: 'absolute', bottom: 12, right: 12 }}>
                            <Image style={{ width: 90, height: 90 }} source={require('../../assets/images/costumer.png')} />
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

                <View style={{backgroundColor: 'white', marginVertical: 40, paddingBottom: 30,
                     borderColor: "#20F6591A", borderWidth: 1, borderRadius: 32, paddingTop: 40}}>
                    <Text style={{color: '#6C7278', fontWeight: '500', fontSize: 12, 
                        marginHorizontal: 20, marginBottom: 12}}>Descrição</Text>
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

export default DoctorTelMedicin;

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