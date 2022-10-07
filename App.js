import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import {faker} from "@faker-js/faker";
import {useEffect, useState} from "react";
import * as Location from 'expo-location';
import axios from 'axios';

export default function App() {

    // const backendUrl = "https://locationpicker.herokuapp.com"
    const backendUrl = "http://localhost:8081"

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

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);


    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    function sendPing() {
        const lat_long = [location.coords.latitude, location.coords.longitude].join(" ");
        console.log(`lat_long ${lat_long} name ${yourName}`)
        axios.post(`${backendUrl}/ping`, { location: lat_long, user: yourName })
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
            .catch(err => console.log(err));
    }

    return (
    <View style={styles.container}>
        <Text>Hallo {yourName}</Text>
        <Button onPress={sendPing} title={"Stuur locatie"}/>
        <Text>{friendName}</Text>

        <StatusBar style="auto" />
    </View>
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
