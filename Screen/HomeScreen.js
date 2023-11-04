import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Database from "../DataBase";

const HomeScreen = ({ navigation }) => {
    const [hikes, setHikes] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await Database.getHikes();
                setHikes(data);
            } catch (error) {
                console.log("Error fetching hikes", error);
            }
        };
        fetchData();
    }, [isFocused]);

    const handleDeleteHike = async (id) => {
        await Database.deleteHike(id);
        const data = await Database.getHikes();
        setHikes(data);
    };
    const handleDeleteAllHike = async () => {
        try {
            await Database.deleteAllHike();
            // After successfully deleting all hikes, update the state to reflect the empty list of hikes
            setHikes([]);
        } catch (error) {
            console.log("Error deleting all hikes", error);
        }
    };
    
    const renderHikeItem = ({ item }) => (
        <TouchableOpacity
            style={styles.todoItem}
            onPress={() => navigation.navigate("Detail", { hike: item })}
        >
            <Text>{item.hikeName}</Text>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteHike(item.id)}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.deleteAllButton} onPress={() => handleDeleteAllHike()}>
                <Text style={styles.deleteButtonText}>Delete All</Text>
            </TouchableOpacity>
            <FlatList
                data={hikes}
                renderItem={renderHikeItem}
                keyExtractor={(item) => item.id.toString()}
            />
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    todoItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        marginLeft:20,
        fontSize:30,
    },
    deleteButton: {
        backgroundColor: "red",
        padding: 8,
        borderRadius: 4,
    },
    deleteAllButton: {
        backgroundColor: "red",
        padding: 8,
        borderRadius: 4,
        marginLeft:300,
        marginBottom:10,
    },
    deleteButtonText: {
        color: "white",
        fontWeight: "bold",
        alignItems: "center",
    },
    addButton: {
        backgroundColor: "green",
        padding: 16,
        borderRadius: 4,
        alignItems: "center",
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default HomeScreen;