import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const FichaMedica = () => {
    return (
        <ScrollView
            contentContainerStyle={{
                paddingTop: 0,
                paddingBottom: 200
            }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.fichaText}>Ficha do Utente</Text>
                    <View style={styles.securityContainer}>
                        <Image source={require('../../assets/images/security.png')} />
                        <Text style={{ fontWeight: '400', color: 'white' }}>Segurança da informação</Text>
                    </View>
                </View>

                <View style={styles.personalInfo}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.nameAb}>FJ</Text>
                        </View>
                        <View>
                            <Text style={styles.name}>Fortunato francisco Joaquim</Text>
                            <Text style={styles.infoText}>{"45"} anos - {"Masculino"}</Text>
                            <Text style={styles.infoText}>N de utente: {'UT-0000007'}</Text>
                            <Text style={styles.infoText}>{958591598}</Text>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 1, backgroundColor: '#ABB5BE' }}></View>
                    <View>
                        <Text style={styles.extraInfoText}>BI/Cartão de cidadão: {'002356BG34332'}</Text>
                        <Text style={styles.extraInfoText}>Morada: {'Luanda'}</Text>
                        <Text style={styles.extraInfoText}>Profissão: {'Mecânico'}</Text>
                    </View>

                </View>
                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{ fontSize: 18, margin: 20, color: '#1CA625', fontWeight: '500' }}>Dados biológicos</Text>
                </View>

                <View style={{ width: '100%', backgroundColor: 'white', borderBottomEndRadius: 16, borderBottomStartRadius: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                    <View style={{ padding: 30, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Text style={{ color: '#ABB5BE' }}>
                            Tipo sanguinio {'\n'}
                            <Text style={{ color: 'black' }}>O+</Text>
                        </Text>
                        <Text style={{ color: '#ABB5BE' }}>
                            Factor RH {'\n'}
                            <Text style={{ color: 'black' }}>positivo</Text>
                        </Text>
                    </View>
                    <View style={{ padding: 30, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Text style={{ color: '#ABB5BE' }}>
                            Peso estimado/Alturaactor HR {'\n'}
                            <Text style={{ color: 'black' }}>93.5 kg/1.93 m</Text>
                        </Text>
                        <Text style={{ color: '#ABB5BE' }}>
                            IMR {'\n'}
                            <Text style={{ color: 'black' }}>24.7</Text>
                        </Text>
                    </View>
                </View>

                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{ fontSize: 18, margin: 20, color: '#1CA625', fontWeight: '500' }}>Parâmetro de Saúde</Text>
                </View>

                <View style={{
                    backgroundColor: '#20F6591A', width: '100%',
                    paddingVertical: 25, display: 'flex',
                    flexDirection: 'column', alignItems: 'center',
                    borderBottomEndRadius: 16, borderBottomStartRadius: 16,
                    borderTopLeftRadius: 16, borderTopRightRadius: 16
                }}>
                    <Text style={{ textAlign: 'center', color: '#1CA625', fontSize: 15, fontWeight: 400 }}>
                        Ligue o seu smartwatch para sincronizar {'\n'}
                        automaticamente os seus parâmetros de saúde
                    </Text>

                    <TouchableOpacity>
                        <View style={{
                            backgroundColor: '#0DF205', paddingVertical: 8,
                            paddingHorizontal: 16, borderRadius: 20, marginTop: 20
                        }}>
                            <Text style={{ color: 'white', fontWeight: '500' }}>
                                Ligar dispositivo
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>


             <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                <View style={{ marginTop: 40, marginRight: 10, borderWidth: 1, borderColor: '#E8E8E8', width: 220, height: 220, backgroundColor: 'white', borderRadius: 20, padding: 14 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#1CA625', fontSize: 14, fontWeigth: '500' }}>Batimento {"\n"} cardíaco</Text>
                        <Image source={require('../../assets/images/wave.png')} />
                    </View>
                    <View style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Image source={require('../../assets/images/empty.png')} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0DF205', paddingVertical: 4, borderRadius: 14, marginTop: 8 }}>
                        <Text style={{ fontWeight: '500', color: 'white' }}>Sem dados</Text>
                    </View>

                    <Text style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: '#B9C0C9', fontWeigth: '500' }}>
                        sincronize o smartwatch para {'\n'}
                        consultar leituras
                    </Text>

                    <TouchableOpacity>
                        <Text style={{ marginTop: 12, textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#1CA625' }}>Ver Historico</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 40, marginRight: 10, borderWidth: 1, borderColor: '#E8E8E8', width: 220, height: 220, backgroundColor: 'white', borderRadius: 20, padding: 14 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#1CA625', fontSize: 14, fontWeigth: '500' }}>Pressão {"\n"} arterial</Text>
                        <Image source={require('../../assets/images/footsteps.png')} />
                    </View>
                    <View style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Image source={require('../../assets/images/empty.png')} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0DF205', paddingVertical: 4, borderRadius: 14, marginTop: 8 }}>
                        <Text style={{ fontWeight: '500', color: 'white' }}>Sem dados</Text>
                    </View>

                    <Text style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: '#B9C0C9', fontWeigth: '500' }}>
                        sincronize o smartwatch para {'\n'}
                        consultar leituras
                    </Text>

                    <TouchableOpacity>
                        <Text style={{ marginTop: 12, textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#1CA625' }}>Ver Historico</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 40, borderWidth: 1, borderColor: '#E8E8E8', width: 220, height: 220, backgroundColor: 'white', borderRadius: 20, padding: 14 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#1CA625', fontSize: 14, fontWeigth: '500' }}>Calorias {"\n"} ingeridas</Text>
                        <Image source={'../../assets/images/footsteps.png'} />
                    </View>
                    <View style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Image source={require('../../assets/images/empty.png')} />
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0DF205', paddingVertical: 4, borderRadius: 14, marginTop: 8 }}>
                        <Text style={{ fontWeight: '500', color: 'white' }}>0 kcal</Text>
                    </View>

                    <Text style={{ marginTop: 12, textAlign: 'center', fontSize: 12, color: '#B9C0C9', fontWeigth: '500' }}>
                        sincronize o smartwatch para {'\n'}
                        consultar leituras
                    </Text>

                    <TouchableOpacity>
                        <Text style={{ marginTop: 12, textAlign: 'center', fontSize: 12, fontWeight: '700', color: '#1CA625' }}>Ver Historico</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
                <View style={{marginTop: 20}}>
                    <Image source={require('../../assets/images/outlook.png')}/>
                </View>

                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{ fontSize: 18, margin: 20, color: '#1CA625', fontWeight: '500' }}>Histórico alimentar</Text>
                </View>

                <TouchableOpacity>
                    <View style={{
                        backgroundColor: '#0DF205', paddingVertical: 8,
                        paddingHorizontal: 80, borderRadius: 20, marginTop: 20
                    }}>
                        <Text style={{ color: 'white', fontWeight: '500' }}>
                            Registrar refeição
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={{
                    backgroundColor: 'white', width: '100%',
                    display: 'flex',
                    flexDirection: 'column', alignItems: 'center',
                    borderBottomEndRadius: 16, borderBottomStartRadius: 16,
                    borderTopLeftRadius: 16, borderTopRightRadius: 16, marginTop: 20,
                    paddingVertical: 60
                }}>
                    <Text style={{ textAlign: 'center', color: '#ABB5BE', fontSize: 15, fontWeight: 500 }}>
                        Sem regitro alimentares
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default FichaMedica;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        paddingBottom: 14,
        borderBottomEndRadius: 16,
        borderBottomStartRadius: 16,
        backgroundColor: 'white'
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
    },
    personalInfo: {
        width: '100%',
        marginTop: 30,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: 'white',
        paddingHorizontal: 30,
        paddingVertical: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        borderBottomEndRadius: 16,
        borderBottomStartRadius: 16,
    },
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
    infoText: { color: '#ABB5BE', fontWeight: '400', fontSize: 14 },
    name: {
        color: '#000000',
        fontWeight: '500',
        fontSize: 16,
        marginBottom: 6
    },
    extraInfoText: {
        color: '#ABB5BE', fontWeight: '400', fontSize: 12
    }
})