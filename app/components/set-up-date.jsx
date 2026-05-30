import { Text, View, TouchableOpacity } from 'react-native'
import Pickery from '../picker'
import InputField from '../components/inputField'

const SetDate = () => {
    return (
        <View style={{
            display: 'flex', flexDiretion: 'column',
            alignItems: 'center', backgroundColor: 'white', justifyContent: 'center',
            borderRadius: 32, margin: 20, paddingBottom: 20, borderWidth:1, 
            borderColor: '#D9D9D9'
        }}>
            <Text style={{
                marginTop: 40, fontWeight: '500', fontSize: 14,
                color: '#000000', marginBottom: 60
            }}>Agendar consulta para telemedicina
            </Text>
            <View>
                <Text style={{
                    color: '#6C7278', fontSize: 12, fontWeight: '500',
                    marginBottom: 8
                }}>Especialidade</Text>
                <Pickery selectOptions={['Especialidade','Fisioterapia', 'Hemodialise', 'outro']} width='300' />
            </View>
            <InputField fieldName='data' placeholder={''} />

            <TouchableOpacity style={{
                backgroundColor: '#0DF205',
                paddingHorizontal: 100,
                textAlign: 'center',
                color: '#FFFFFF',
                paddingVertical: 13,
                borderRadius: 8,
                marginTop: 30,
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
    )
}

export default SetDate