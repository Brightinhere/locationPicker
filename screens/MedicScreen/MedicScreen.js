import React, {useEffect, useState} from 'react'
import {Button, Dimensions, StyleSheet, Text, View} from 'react-native'
import MapView from "react-native-maps";
import * as Location from "expo-location";
import {LocationAccuracy} from "expo-location/src/Location.types";
import axios from "axios";

export default function MedicScreen(props) {
    // const backendUrl = "http://localhost:8081"

    const backendUrl = "https://locationpicker.herokuapp.com"
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            // let { prov } = await Location.enableNetworkProviderAsync();

            // console.log(prov)
            // if (prov != null) {
            //     setErrorMsg('Permission to access higher location accuracy was denied');
            //     return;
            // }

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({accuracy: LocationAccuracy.BestForNavigation, mayShowUserSettingsDialog: true});
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    async function updateLocation() {

        axios.get(backendUrl + '/getLocation')
            .then(response => {
                // handle success
                const locArray = response.data.location.location.split(' ')
                console.log(locArray[0])
                console.log(locArray[1])
                setLocation({
                    coords: {
                        latitude: locArray[0],
                        longitude: locArray[1]
                    }
                })
            })
            .catch(error => {
                // handle error
                console.log(error)
            })
    }


    return (
        <View style={styles.container}>
            <Button onPress={updateLocation} title={"Get Last Loc"}/>
            <Text>Medic Screen</Text>
            {location != null && location.coords != null &&
                <View>
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