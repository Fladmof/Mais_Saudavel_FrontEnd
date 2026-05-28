import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import TabOption from '../components/tabOption';

const HistoricPart = ({ title, desc1, desc2 }) => {
    const router = useRouter();
    
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
                <TouchableOpacity onPress={() => router.push("../components/set-up-date")}>
                    <View style={{
                        width: 90, borderWidth: 1, height: 52,
                        borderRadius: 24, display: 'flex', flexDirecion: 'row',
                        alignItems: 'center', justifyContent: 'center',
                        borderColor: '#E8E8E8'
                    }}>
                        <Text style={{
                            fontWeight: '500', fontSize: 14, color: '#1CA625'
                        }}>Adicionar</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Medication = () => {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={{
            paddingBottom: 20
        }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.fichaText}>Medicação</Text>
                    <View style={styles.securityContainer}>
                        <Image source={require('../../assets/images/security.png')} />
                        <Text style={{ fontWeight: '400', color: 'white' }}>Segurança da informação</Text>
                    </View>
                </View>
                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{ fontSize: 18, margin: 20, color: '#1CA625', fontWeight: '500' }}>Condições especiais</Text>
                </View>

                <View style={{ borderRadius: 32, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', height: 90, paddingBottom: 0, justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{ marginBottom: -24 }}>
                        <Image source={require('../../assets/images/Left.png')} />
                    </TouchableOpacity>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <TabOption name={'Diabete'} />
                        <TabOption name={'Alergia'} />
                        <TabOption name={'Cadeirante'} />

                    </View>

                    <TouchableOpacity style={{ marginBottom: -24 }}>
                        <Image source={require('../../assets/images/Right.png')} />
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={{ fontSize: 18, margin: 20, color: '#1CA625', fontWeight: '500' }}>Alergia registrada</Text>
                </View>

                <View style={{
                    backgroundColor: 'white', width: '100%', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', borderRadius: 32
                }}>
                    <Text style={{
                        fontWeight: 400, fontSize: 13, fontFamily: 'space-grotesk', color: '#ABB5BE',
                        margin: 20
                    }}>
                        Selecione as categorias aplicáveis e descreve os detalhes abaixo
                    </Text>

                    <View style={{ borderRadius: 32, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', height: 90, paddingBottom: 0, justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ marginBottom: -24 }}>
                            <Image source={require('../../assets/images/Left.png')} />
                        </TouchableOpacity>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <TabOption name={'Comida'} />
                            <TabOption name={'Enlatados'} />
                            <TabOption name={'Cosméticos'} />

                        </View>

                        <TouchableOpacity style={{ marginBottom: -24 }}>
                            <Image source={require('../../assets/images/Right.png')} />
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
                    display: 'flex', flexDirection: 'row', width: '100%',
                    backgroundColor: 'white', padding: 20, justifyContent: 'space-around', alignItems: 'center'
                }}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.nameAb}>FJ</Text>
                    </View>
                    <View style={{ marginLeft: -20 }}>
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
                            <Image source={require('../../assets/images/telemedicina.png')} />
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
                    width: '100%', backgroundColor: 'white',
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
                    }}>Emergência</Text>
                </View>

                <View style={{
                    width: '100%', backgroundColor: 'white', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', padding: 30, borderRadius: 32
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

export default Medication;

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
    nameContainer: {
        width: 70,
        height: 70,
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