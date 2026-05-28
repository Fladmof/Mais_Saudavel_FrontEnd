import { Text, ScrollView, View, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import TabOption from './components/tabOption';
import { useRouter } from "expo-router";

const HistoricPart = ({ title, desc1, desc2 }) => {

    return (
        <View style={{ width: '100%', paddingHorizontal: 20 }}>
            <Text style={{ fontWeight: '500', fontSize: 16, color: '#000000' }}>
                {title}
            </Text>
            <View style={{
                marginTop: 12, display: 'flex', flexDirection: 'row',
                justifyContent: 'space-between', alignItems: 'center'
            }}>
                <Text style={{ color: '#ABB5BE', fontSize: 14 }}>
                    {desc1} {"\n"}
                    {desc2}
                </Text>
                <TouchableOpacity>
                    <View style={{
                        width: 90, borderWidth: 1, height: 52,
                        borderRadius: 24, display: 'flex', flexDirecion: 'row',
                        alignItems: 'center', justifyContent: 'center',
                        borderColor: '#E8E8E8'
                    }}>
                        <Text style={{
                            fontWeight: '500', fontSize: 14, color: '#1CA625'
                        }}>ver</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const PacienteDetalhes = () => {
    const router = useRouter();
    return (
        <ScrollView>
            <View style={{
                flex: 1, backgroundColor: 'white', width: '100%', display: 'flex',
                flexDirection: 'column', alignItems: 'center'
            }}>
                <View style={{
                    width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'center', paddingVertical: 10, backgroundColor: 'white',
                    borderBottomLeftRadius: 32, borderBottomEndRadius: 32, borderColor: "#20F6591A",
                    borderWidth: 1
                }}>
                    <Image source={require("../assets/images/mais-saudavel-logo.png")} />
                </View>
                <View style={{ width: '100%' }}>
                    <TouchableOpacity onPress={() => router.push("/(medicoTabs)/home")}>
                        <Image source={require('../assets/images/Left.png')} />
                    </TouchableOpacity>
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

                <View style={{
                    width: '100%', backgroundColor: 'white', borderBottomEndRadius: 16, borderBottomStartRadius: 16, borderTopLeftRadius: 16,
                    borderTopRightRadius: 16, borderColor: "#20F6591A", borderWidth: 1
                }}>
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
                    <Text style={{ fontSize: 18, margin: 20, color: '#1CA625', fontWeight: '500' }}>Condições especiais</Text>
                </View>

                <View style={{
                    borderRadius: 32, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center',
                    backgroundColor: 'white', height: 90, paddingBottom: 0, justifyContent: 'space-between', borderColor: "#20F6591A", borderWidth: 1
                }}>
                    <TouchableOpacity style={{ marginBottom: -24 }}>
                        <Image source={require('../assets/images/Left.png')} />
                    </TouchableOpacity>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <TabOption name={'Diabete'} />
                        <TabOption name={'Alergia'} />
                        <TabOption name={'Cadeirante'} />

                    </View>

                    <TouchableOpacity style={{ marginBottom: -24 }}>
                        <Image source={require('../assets/images/Right.png')} />
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{ fontSize: 18, margin: 20, color: '#1CA625', fontWeight: '500' }}>Alergia registrada</Text>
                </View>

                <View style={{
                    backgroundColor: 'white', width: '100%', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', borderRadius: 32, borderColor: "#20F6591A", borderWidth: 1
                }}>
                    <Text style={{
                        fontWeight: 400, fontSize: 13, fontFamily: 'space-grotesk', color: '#ABB5BE',
                        margin: 20
                    }}>
                        Selecione as categorias aplicáveis e descreve os detalhes abaixo
                    </Text>

                    <View style={{ borderRadius: 32, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', height: 90, paddingBottom: 0, justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ marginBottom: -24 }}>
                            <Image source={require('../assets/images/Left.png')} />
                        </TouchableOpacity>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <TabOption name={'Comida'} />
                            <TabOption name={'Enlatados'} />
                            <TabOption name={'Cosméticos'} />

                        </View>

                        <TouchableOpacity style={{ marginBottom: -24 }}>
                            <Image source={require('../assets/images/Right.png')} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 26, paddingTop: 20, marginBottom: 20 }}>
                        <Text style={{ fontSize: 15, fontWeight: '500', color: '#000000' }}>Descrição livre</Text>
                    </View>
                    <TextInput placeholder='Damedoim e pólen' style={{
                        width: '84%', borderWidth: 1,
                        borderRadius: 10, marginBottom: 20,
                        borderColor: "#20F6591A", height: 70, paddingHorizontal: 10
                    }}
                        placeholderTextColor="#B9C0C9" />
                </View>

                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{
                        fontSize: 18, margin: 20, color: '#1CA625',
                        fontWeight: '500'
                    }}>Históricos</Text>
                </View>

                <HistoricPart title={"Receitas médicas"} desc1={"Tire uma fotografia ou carregue a"}
                    desc2={"imagem da receita"} />
                <View style={{ width: '90%', height: 1, backgroundColor: '#ABB5BE', margin: 20 }}></View>
                <HistoricPart title={"Exames"} desc1={"Registrar imagens para"}
                    desc2={"consulta posterior"} />
                <View style={{ width: '90%', height: 1, backgroundColor: '#ABB5BE', margin: 20 }}></View>
                <HistoricPart title={"Consultas que me lembro"} desc1="Descreva o hospital, os exames"
                    desc2="realizados, a receita e o médico" />

                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{
                        fontSize: 18, margin: 20, color: '#1CA625',
                        fontWeight: '500'
                    }}>Médico assistente</Text>
                </View>

                <View style={{
                    display: 'flex', flexDirection: 'row', width: '100%', borderRadius: 32,
                    backgroundColor: 'white', padding: 20, justifyContent: 'space-around', alignItems: 'center', borderColor: "#20F6591A", borderWidth: 1
                }}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.nameAb}>FJ</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: '#000000', fontWeight: '500', fontSize: 14 }}>Dr. João Silva</Text>
                        <Text style={{ color: '#ABB5BE', fontSize: 14 }}>Clínico geral</Text>
                        <Text style={{ color: '#ABB5BE', fontSize: 14 }}>958654234</Text>
                        <Text style={{ color: '#ABB5BE', fontSize: 14 }}>Clínica central de Luanda</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push("/telemedicine/videoCallDoctor")}>
                        <view style={{
                            backgroundColor: 'red', width: 120, height: 48, display: 'flex',
                            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#0DF205', borderRadius: 24
                        }}>
                            <Image source={require('../assets/images/telemedicina.png')} />
                            <Text style={{ color: 'white' }}>Telemedicina</Text>
                        </view>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{
                        fontSize: 18, margin: 20, color: '#FF383C',
                        fontWeight: '500'
                    }}>Contacto de emergência</Text>
                </View>

                <View style={{
                    width: '100%', backgroundColor: 'white', borderColor: "#20F6591A", borderWidth: 1,
                    display: 'flex', flexDirection: 'row', padding: 20, gap: 20,
                    borderRadius: 32
                }}>
                    <View style={[styles.nameContainer, { backgroundColor: '#F620201A' }]}>
                        <Text style={[styles.nameAb, { color: '#FF383C' }]}>FJ</Text>
                    </View>
                    <View>
                        <Text style={{
                            color: '#000000', fontWeight: '500', fontSize: 16,
                            marginBottom: 6
                        }}>Dr. João Silva</Text>
                        <Text style={{ color: 'gray' }}>Irmã</Text>
                        <Text style={{ color: 'red' }}>958765432</Text>
                    </View>
                </View>

                 <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{
                        fontSize: 18, margin: 20, color: '#1CA625',
                        fontWeight: '500'
                    }}>Parametro de saúde</Text>
                </View>


                <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} >
                    <View style={{ marginTop: 40, marginRight: 10, borderWidth: 1, borderColor: '#E8E8E8', width: 220, height: 220, backgroundColor: 'white', borderRadius: 20, padding: 14 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: '#1CA625', fontSize: 14, fontWeigth: '500' }}>Batimento {"\n"} cardíaco</Text>
                            <Image source={require('../assets/images/wave.png')} />
                        </View>
                        <View style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <Image source={require('../assets/images/empty.png')} />
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
                            <Image source={require('../assets/images/footsteps.png')} />
                        </View>
                        <View style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <Image source={require('../assets/images/empty.png')} />
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
                            <Image source={'../assets/images/footsteps.png'} />
                        </View>
                        <View style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <Image source={require('../assets/images/empty.png')} />
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
                <View style={{ marginVertical: 20 }}>
                    <Image source={require('../assets/images/outlook.png')} />
                </View>

                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{
                        fontSize: 18, margin: 20, color: '#1CA625',
                        fontWeight: '500'
                    }}>Emergência</Text>
                </View>

                <View style={{
                    width: '100%', backgroundColor: 'white', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', padding: 30, borderRadius: 32, borderColor: "#20F6591A", borderWidth: 1,
                }}>
                    <Text style={{ marginBottom: 35, color: '#1CA625', fontSize: 16, fontWeight: '500' }}>Emergência</Text>
                    <Text style={{ color: '#ABB5BE', fontWeight: '700', fontSize: 15, marginBottom: 30 }}>Serviço  indisponível</Text>
                    <TouchableOpacity>
                        <View style={{
                            backgroundColor: '#0DF205', paddingVertical: 8,
                            paddingHorizontal: 80, borderRadius: 20, marginTop: 20
                        }}>
                            <Text style={{ color: 'white', fontWeight: '500' }}>
                                Chamar apoio
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

export default PacienteDetalhes;

const styles = StyleSheet.create({
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
        borderColor: "#20F6591A",
        borderWidth: 1
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
    infoText: { color: '#ABB5BE', fontWeight: '500', fontSize: 14 },
    name: {
        color: '#000000',
        fontWeight: '500',
        fontSize: 16,
        marginBottom: 6
    },
    extraInfoText: {
        color: '#ABB5BE', fontWeight: '500', fontSize: 12
    }
})