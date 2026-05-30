import { View, Text, StyleSheet, TextInput } from 'react-native';

const InputField = ({fieldName, placeholder}) => {
    return (
        <View style={{ marginTop: 12 }}>
            <view style={styles.inputField}>
                <Text style={{ color: 'grey' }}>{fieldName}</Text>
                <TextInput
                    placeholder={placeholder}
                    style={styles.input}
                    placeholderTextColor={'#B9C0C9'}
                />
            </view>
        </View>
    )
}
export default InputField;

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
});