import {Button} from "react-native";
import {useEffect, useState} from "react";

const LoginScreen = ({ navigation }) => {
    return (
        <Button
            title="Go to Jane's profile"
            onPress={() =>
                navigation.navigate('Profile', { name: 'Jane' })
            }
        />
    );
};

export default LoginScreen
