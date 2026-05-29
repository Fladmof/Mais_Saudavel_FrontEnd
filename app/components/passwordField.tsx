import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

const PasswordField = ({ fieldName, placeholder, value, onChangeText }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{fieldName}</Text>
      <View style={[styles.input, styles.inputRow]}>
        <TextInput
          placeholder={placeholder}
          style={styles.inputText}
          placeholderTextColor={'#9AA5B1'}
          secureTextEntry
          value={value}
          onChangeText={onChangeText}
          autoCapitalize='none'
        />
        <TouchableOpacity activeOpacity={0.7} style={styles.eyeButton}>
          <Image source={require('../../assets/images/eye-off.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PasswordField;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 14,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    color: '#5E6E7E',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D8E1EA',
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputRow: {
    justifyContent: 'space-between',
  },
  inputText: {
    flex: 1,
    color: '#1F2A37',
    fontSize: 16,
  },
  eyeButton: {
    marginLeft: 8,
    opacity: 0.7,
  },
});
