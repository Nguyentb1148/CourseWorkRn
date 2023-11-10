import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Switch, Modal, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import Database from '../DataBase';

const AddHike = () => {
    const [hikeName, setHikeName] = useState('');
    const [location, setLocation] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [parkingAvailable, setParkingAvailable] = useState(false); // Set default value to 'No'
    const [length, setLength] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [description, setDescription] = useState('');
    const [isDifficultyPickerVisible, setDifficultyPickerVisible] = useState(false);

    const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Very Hard'];

    const handleAddHike = async () => {
        const originalDate = new Date(selectedDate);
        console.log(originalDate);
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0');
        const day = String(originalDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        if(isNaN(length) || +length <= 0 ){
            Alert.alert("Error","Length of the hike should be positive number")
            return;
        }
        if (!hikeName || !location || !formattedDate ||  !difficulty || !description) {
            Alert.alert("Error", "Please enter valid data for all fields.");
            return;
        }

        console.log('add called:', formattedDate);
        await Database.addHike(hikeName, location, formattedDate, parkingAvailable ? 'Yes' : 'No', length, difficulty, description);
        console.log("parking available option: " + (parkingAvailable ? 'Yes' : 'No'));
        Alert.alert("Success", "Your Hike added");
    };
    const showDatePicker = () => {
        setDatePickerVisible(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };
    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePicker();
    };

    return (
        <View style={styles.container}>

            <Text style={styles.text}>Name of the Hike</Text>
            <TextInput
                style={styles.input}
                placeholder="Hike Name"
                onChangeText={(text) => setHikeName(text)}
                value={hikeName}
            />

            <Text style={styles.text}>Location</Text>
            <TextInput
                style={styles.input}
                placeholder="Location"
                onChangeText={(text) => setLocation(text)}
                value={location}
            />

            <Text style={styles.text}>Date of the hike</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 2 }}>
                {selectedDate ?  new Date(selectedDate).toLocaleDateString() : 'No date selected'}
            </Text>
            <Button title="Select a date" onPress={showDatePicker} />
            <DateTimePickerModal
                date={selectedDate}
                isVisible={datePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            <Text style={styles.text}>Parking available</Text>
            <Switch
                style={styles.switch}
                trackColor={{ No: '#767577', Yes: '#81b0ff' }}
                thumbColor={'#f5dd4b'}
                onValueChange={(value) => setParkingAvailable(value)}
                value={parkingAvailable}
            />

            <Text style={styles.text}>Length of the hike</Text>
            <TextInput
                style={styles.input}
                placeholder="Length ( m)"
                onChangeText={(text) => setLength(text)}
                value={length}
            />

            <Text style={styles.text}>Difficulty level</Text>
            <TouchableOpacity onPress={() => setDifficultyPickerVisible(true)}>
                <Text style={styles.pickerText}>{difficulty}</Text>
            </TouchableOpacity>
            <Modal transparent={true} animationType="slide" visible={isDifficultyPickerVisible}>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={difficulty} onValueChange={(itemValue) => {
                            setDifficulty(itemValue);
                            setDifficultyPickerVisible(false);
                        }}
                    >
                        {difficultyLevels.map((level) => (
                            <Picker.Item label={level} value={level} key={level} />
                        ))}
                    </Picker>
                </View>
            </Modal>
            <Text style={styles.text}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                onChangeText={(text) => setDescription(text)}
                value={description}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddHike}>
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    text: {
        margin: 5,
        fontWeight: 'bold',
        fontSize: 20,
    },
    input: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 5,
    },
    switch: {
        marginBottom: 20,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#7087ff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pickerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
    },
    pickerText: {
        fontSize: 18,
        marginBottom: 5,
    },
});

export default AddHike;
