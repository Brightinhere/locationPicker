import React, {useEffect, useState} from 'react'
import {Dimensions, StyleSheet, Text, View} from 'react-native'
import MapView from "react-native-maps";
import * as Location from "expo-location";

export default function MedicScreen(props) {
    // const backendUrl = "http://localhost:8081"

    const backendUrl = "https://locationpicker.herokuapp.com"
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

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
        <View>
            <Text>Medic Screen</Text>
            {location != null && location.coords != null &&
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
        </View>
    )
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