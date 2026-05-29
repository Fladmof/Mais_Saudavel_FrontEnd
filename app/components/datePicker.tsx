
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function DataPicker() {

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    }
    const onChange = ({ type }, selectedDate) => {
        if (type === "set" && selectedDate) {
            const currentDate = selectedDate;
            setDate(currentDate);
        } else {
            toggleDatePicker();
        }
    }

    return (
        <View style={styles.container}>
            <Text>date of birth</Text> 
          <DateTimePicker 
                mode='date'
                display="spinner"
                value={date}
                onChange={onChange}
            />
         
         { !showPicker &&
            <Pressable
              onPress={toggleDatePicker}
            >
                <TextInput
                  placeholder='sat aug 21 2004'
                  editable={false}
                />
            </Pressable>

         }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
    }
}) 

