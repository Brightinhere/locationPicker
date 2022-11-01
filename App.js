import 'react-native-gesture-handler';
import React, { useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {HomeScreen, OldHomeScreen} from './screens/index'
import {decode, encode} from 'base-64'
import {Text, StyleSheet, View, Switch} from "react-native";
import MedicScreen from "./screens/MedicScreen/MedicScreen";

const Stack = createStackNavigator();

export default function App() {

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    const [isMedic, setIsMedic] = useState(false);
    const toggleSwitch = () => setIsMedic(previousState => !previousState);

    return (
        <View style={styles.container}>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isMedic ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isMedic}
            />

            {isMedic &&

                <MedicScreen/>
            }

            {!isMedic &&

                <OldHomeScreen/>
            }
        </View>
    );
}

const styles = StyleSheet.create( {
    container: {
        marginTop:80,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
        color: 'black'
    }
})