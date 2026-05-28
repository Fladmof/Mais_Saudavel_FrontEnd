import {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

const TabOption = ({ name }) => {
    const [activeSelect, setActiveSelect] = useState(false);
    return (
        <TouchableOpacity onPress={() => setActiveSelect(!activeSelect)}
        style={{borderWidth: 1, borderRadius: 24, borderColor: "#E8E8E8", marginTop: -3,}}>
            <view style={{
                borderWidth: 1, borderColor: "#E8E8E8",
                backgroundColor: activeSelect ? '#20F6591A' : 'white',
                width: 90, height: 52, display: 'flex', 
                justifyContent: 'center', alignItems: 'center',
                borderRadius: 24
            }} >
                <Text style={{
                    textAlign: 'center', fontSize: 14,
                    fontWeight: '500',
                    color: activeSelect ? '#1CA625' : '#000000'
                }}>{name}</Text>
            </view>
        </TouchableOpacity>
    )
}

export default TabOption