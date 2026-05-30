import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useState, useRef } from 'react';


export default function Pickery({width, selectOptions}) {

    const [selectedItem, setSelectedItem] = useState('');
    const pickerRef = useRef(null);

    return (
        <View style={styles.container}>
            <Picker
             ref = {pickerRef}
             selectedValue={selectedItem}
             onValueChange = {(itemValue) => {
                setSelectedItem(itemValue);

               // alert(itemValue);
             }}
             style={{width: Number(width)}}
            >
              {selectOptions.map((option, index) => (
                 <Picker.Item label={option} value={option} />
              ))}
            </Picker>
            <StatusBar style='auto' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        borderColor: 'red',
        height: 200,
    }
}) 

