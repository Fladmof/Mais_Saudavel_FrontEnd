import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

const PasswordField = ({ fieldName, placeholder }) => {
    return (
        <View style={[{ marginTop: 18 }, styles.inputField]}>
            <view style={styles.inputField}>
                <Text style={{ color: 'grey' }}>{fieldName}</Text>
                <View style={[styles.inputeye, styles.input]}>
                    <TextInput
                        placeholder={placeholder}
                        style={{ flex: 1, padding: 4 }}
                        placeholderTextColor={'#B9C0C9'}
                        secureTextEntry
                    />
                    <view>
                        <TouchableOpacity>
                            <Image source={require('../../assets/images/eye-off.png')} />
                        </TouchableOpacity>
                    </view>
                </View>
            </view>
        </View>
    )
}
export default PasswordField;

const styles = StyleSheet.create({
    inputField: {
        display: 'flex',
        flexDirection: 'column'
    },
    input: {
        flex: 1,
        width: 300,
        borderWidth: 1,
        borderColor: '#EDF1F3',
        padding: 10,
        borderRadius: 8,
    },
    inputeye: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
});