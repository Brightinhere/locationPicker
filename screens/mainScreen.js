import React, {useEffect, useState} from "react";
import {Button, Dimensions, StyleSheet, Text, View} from "react-native";
import {faker} from "@faker-js/faker";
import * as Location from "expo-location";
import axios from "axios";
import MapView from "react-native-maps";
import {StatusBar} from "expo-status-bar";


const MainScreen = ({ navigation }) => {

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
            <Button onPress={sendPing(location, yourName, backendUrl)} title={"Stuur locatie"}/>
            <Text>{friendName}</Text>
            {location != null &&
                <View style={styles.container}>
                    <MapView style={styles.map}
                             initialRegion={{
                                 latitude: location.coords.latitude,
                                 longitude: location.coords.longitude,
                                 latitudeDelta: 0.0,
                                 longitudeDelta: 0.0,
                             }}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude
                            }}
                            title={"title"}
                            description={"description"}
                        />
                    </MapView>
                </View>
            }
            <StatusBar style="auto" />
        </View>
    );
};

function sendPing(location, yourName, backendUrl) {
    const lat_long = [location.coords.latitude, location.coords.longitude].join(" ");
    console.log(`lat_long ${lat_long} name ${yourName}`)
    axios.post(`${backendUrl}/ping`, { location: lat_long, user: yourName })
        .then(res => {
            console.log(res);
            console.log(res.data);
        })
        .catch(err => console.log(err));
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



export default MainScreen;