import React, { useEffect } from "react";
import { StyleSheet, Text, View,Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddHike from './Screen/AddHike';
import DetailScreen from './Screen/DetailScreen';
import DataBase from './DataBase';
import HomeScreen from "./Screen/HomeScreen";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();
export default function App() {
  useEffect(() => {
    DataBase.initDatabase();
  }, []);
  return (
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeTab}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
function HomeTab() {
  return (
    <Tab.Navigator styles={styles.container}>
      <Tab.Screen name="Add" component={AddHike} />
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
