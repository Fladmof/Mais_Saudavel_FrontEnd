import { Text, View, TouchableOpacity, ScrollView } from 'react-native'
import Pickery from '../picker'
import InputField from '../components/inputField'

const AddConsulta = () => {
    return (
        <ScrollView>
            <View style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', backgroundColor: 'white', justifyContent: 'center',
                borderRadius: 32, margin: 20, paddingBottom: 20, borderWidth:1, 
                borderColor: '#D9D9D9'
            }}>
                <Text style={{
                    marginTop: 40, fontWeight: '500', fontSize: 14,
                    color: '#000000', marginBottom: 20
                }}>Consultas que me lembro
                </Text>
                <Text style={{textAlign: 'center', color: '#ABB5BE',
                    fontSize: 14, fontWeight: '500', marginBottom: 24
                }}>
                    Guarde os principais detalhes da consulta {'\n'}
                    para referência rápida
                </Text>
                <View>
                    <Text style={{
                        color: '#6C7278', fontSize: 12, fontWeight: '500',
                        marginBottom: 8
                    }}>Especialidade</Text>
                    <Pickery selectOptions={['Especialidade','Fisioterapia', 'Hemodialise', 'outro']} width='300' />
                </View>
                <InputField fieldName='Hospital' placeholder={''} />
                <InputField fieldName='Consulta' placeholder={'Detalhe a consulta ralizada'} />
                <InputField fieldName='Exames realizados' placeholder={'Detalhe os exames realizados'} />
                <InputField fieldName='Nome do médico' placeholder={''} />

                <TouchableOpacity style={{
                    backgroundColor: '#0DF205',
                    paddingHorizontal: 100,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    paddingVertical: 13,
                    borderRadius: 8,
                    marginTop: 60,
                }}>
                    Agendar consulta
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 126,
                    textAlign: 'center',
                    color: '#FFFFFF',
                    paddingVertical: 13,
                    borderRadius: 8,
                    marginTop: 30,
                    borderWidth: 1,
                    borderColor: '#FF383C'
                }}>
                    <Text style={{color: '#FF383C', fontSize: 15, fontWeight: '500'}}>
                        Cancelar
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default AddConsulta