import React, {useEffect, useState} from "react";
import {Button, Dimensions, StyleSheet, Text, View} from "react-native";
import {faker} from "@faker-js/faker";
import * as Location from "expo-location";
import axios from "axios";
import MapView from "react-native-maps";
import {StatusBar} from "expo-status-bar";


const OldHomeScreen = ({ navigation }) => {

    const backendUrl = "http://localhost:8081"

    // const backendUrl = "https://locationpicker.herokuapp.com/"
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const yourName = faker.name.fullName();
    const friendName = ""

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({accuracy: 6, mayShowUserSettingsDialog: true});
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }




    return (
        <View style={styles.container}>
            <Text>Hallo {yourName}</Text>
            <Button onPress={() => {
                sendPing(location, yourName, backendUrl)
            }} title={"Stuur locatie"}/>
            <Text>{friendName}</Text>

            <StatusBar style="auto" />
        </View>
    );
};

function sendPing(location, yourName, backendUrl) {
    if (location.coords !=  null) {
        const lat_long = [location.coords.latitude, location.coords.longitude].join(" ");
        console.log(`lat_long ${lat_long} name ${yourName}`)
        axios.post(`${backendUrl}/saveLocation`, { location: lat_long, user: yourName })
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
            .catch(err => console.log("Sendping " + err));
    }
}


const styles = StyleSheet.create({
    container: {
        marginTop:50,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width / 5*4,
        height: Dimensions.get('window').height/ 5*4,
    },
});



export default OldHomeScreen;