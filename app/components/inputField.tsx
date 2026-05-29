import { View, Text, StyleSheet, TextInput } from 'react-native';

const InputField = ({ fieldName, placeholder, value, onChangeText, secureTextEntry = false }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{fieldName}</Text>
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor={'#9AA5B1'}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize='none'
      />
    </View>
  );
};

export default InputField;

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
    color: '#1F2A37',
    fontSize: 16,
  },
});
