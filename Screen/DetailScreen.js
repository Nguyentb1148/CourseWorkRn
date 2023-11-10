import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity, Switch, Modal, Alert } from 'react-native';
import Database from "../DataBase";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { forceUpdate } from 'react'
const DetailScreen = ({ route }) => {
    const hike = route.params.hike; // Access the 'hike' object from route.params

    const [hikeDetails, setHikeDetails] = useState(null);
    const [editedHikeName, setEditedHikeName] = useState('');
    const [editedLocation, setEditedLocation] = useState('');
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [editedDate, setEditedDate] = useState(new Date()); // Initialize with the current date
    const [editedParkingAvailable, setEditedParkingAvailable] = useState(false);
    const [editedLength, setEditedLength] = useState('');
    const [editedDifficulty, setEditedDifficulty] = useState('Easy');
    const [editedDescription, setEditedDescription] = useState('');
    const [isDifficultyPickerVisible, setDifficultyPickerVisible] = useState(false);
    const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Very Hard'];
    const [forceRender, setForceRender] = useState(false);
    const [forceRenderKey, setForceRenderKey] = useState(0);

    useEffect(() => {
        const fetchHikeDetails = async () => {
            if (hike && hike.id) {
                try {
                    const details = await Database.getHikeByTitle(hike.id);
                    setHikeDetails(details);
                    setEditedHikeName(details.hikeName);
                    setEditedLocation(details.location);
                    setEditedDate(new Date(details.selectedDate));
                    setEditedParkingAvailable(details.parkingAvailable === 'Yes'); // Update this line
                    setEditedLength(details.length);
                    setEditedDifficulty(details.difficulty);
                    setEditedDescription(details.description);
                } catch (error) {
                    console.log("Error fetching hike details", error);
                }
            }
        };
    
        fetchHikeDetails();
    }, [route.params]);
    
    const updateHike = async () => {

        if(isNaN(editedLength)||+editedLength<=0)
        {
            Alert.alert("Error","Length of the hike should be positive number")
        }
        if (!editedDate || isNaN(editedDate)||!editedHikeName||!editedLocation||!editedDescription) {
            Alert.alert("Error", "Please enter valid data for all fields.")    
            return;
        }
    
        console.log('updateHike called. editedDate:', editedDate);
        console.log('Before update - editedParkingAvailable:', editedParkingAvailable);
    
        const originalDate = new Date(editedDate);
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0');
        const day = String(originalDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
    
        try {
            await Database.updateHike(
                hike.id,
                editedHikeName,
                editedLocation,
                formattedDate,
                editedParkingAvailable ? 'Yes' : 'No',
                editedLength,
                editedDifficulty,
                editedDescription
            );
            console.log('Hike details updated successfully');
            console.log('Updated parkingAvailable:', editedParkingAvailable);
    
            // Add this log statement
            console.log('After update - editedParkingAvailable:', editedParkingAvailable);
        } catch (error) {
            console.error('Hike details update failed,', error);
        }
    };
    
    
    const showDatePicker = () => {
        setDatePickerVisible(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };
    const handleConfirm = (date) => {
        if (date instanceof Date && !isNaN(date)) {
            setEditedDate(date);
        }
        hideDatePicker();
    };
    return (
        <View key={forceRenderKey} style={styles.container}>
            <Text style={styles.text}>Name of the Hike</Text>
            <TextInput
                style={styles.input}
                placeholder="Hike Name"
                value={editedHikeName}
                onChangeText={setEditedHikeName}
            />
            <Text style={styles.text}>Location</Text>
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={editedLocation}
                onChangeText={setEditedLocation}
            />

            <Text style={styles.text}>Date of the hike</Text>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
                {editedDate ? new Date(editedDate).toLocaleDateString() : 'No date selected'}
            </Text>
            <Button title="Select a date" onPress={showDatePicker} />
            <DateTimePickerModal
                value={editedDate}
                isVisible={datePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            <Text style={styles.text}>Parking available</Text>
            <Switch
                style={styles.switch}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={'#f5dd4b'}
                onValueChange={(value) => {
                    console.log('Switch value changed:', value);
                    setEditedParkingAvailable(value);
                }}
                value={editedParkingAvailable}
            />

            <Text style={styles.text}>Length of the hike</Text>
            <TextInput
                style={styles.input}
                placeholder="Length (in m)"
                onChangeText={(text) => setEditedLength(text)}
                value={editedLength}
            />

            <Text style={styles.text}>Difficulty level</Text>
            <TouchableOpacity onPress={() => setDifficultyPickerVisible(true)}>
                <Text style={styles.pickerText}>{editedDifficulty}</Text>
            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType="slide"
                visible={isDifficultyPickerVisible}
            >
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={editedDifficulty}
                        onValueChange={(itemValue) => {
                            setEditedDifficulty(itemValue);
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
                onChangeText={(text) => setEditedDescription(text)}
                value={editedDescription}
            />
            <Button title="Update" onPress={updateHike} />
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

export default DetailScreen;
