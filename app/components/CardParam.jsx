import {View, Text, Image, TouchableOpacity} from 'react-native';

const images = {
    footsteps: require('../../assets/images/footsteps.png')
}

const CardParam = ({tipo, dados, image}) => {
    return (
        <View style={{ marginTop: 40, borderWidth: 1, borderColor: '#E8E8E8', width: 220, height: 220, backgroundColor: 'white', borderRadius: 20, padding: 14 }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#1CA625', fontSize: 14, fontWeigth: '500' }}>Pressão {"\n"} arterial</Text>
                <Image source={images.footsteps} />
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
    )
}

export default CardParam;