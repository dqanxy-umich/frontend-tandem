import React, { useState } from 'react';
import { View, StyleSheet, Alert} from 'react-native';
import Slider from '@react-native-community/slider';
import { DefaultEventsMap } from 'socket.io';
import { Socket } from 'socket.io-client';

interface GameplaySliderProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    userId: number;
    isDisabled: boolean;
    ip: string;
}

const GameplaySlider: React.FC<GameplaySliderProps> = ({ socket, userId, isDisabled, ip }) => {
    const [sliderValue, setSliderValue] = useState(0);

    const handlePressIn = async (value: number) => {
        try {
            console.log("Sending input");
            console.log(userId, value);

            socket?.emit("gameplay", { action: 'input', "user_id": userId, "value": value });

            // const response = await fetch('http://' + ip + '/input', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ "user_id": userId, "value": value }),
            // });

            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }

            Alert.alert('Success', 'Request sent successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to send request');
        }
    };

    const handlePressOut = async () => {
        try {
            console.log("Releasing input");
            console.log(userId);
            
            socket?.emit("gameplay",{ action: 'release', "user_id": userId});
            // const response = await fetch('http://' + ip + '/release', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ "user_id": userId }),
            // });

            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }

            Alert.alert('Success', 'Release request sent successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to send release request');
        } finally {
            setSliderValue(0);
        }
    };

    return (
        <View style={styles.container}>
            <Slider
                style={styles.slider}
                minimumValue={-1}
                maximumValue={1}
                value={sliderValue}
                onValueChange={handlePressIn}
                onSlidingStart={() => handlePressIn(sliderValue)}
                onSlidingComplete={handlePressOut}
                disabled={isDisabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    slider: {
        width: 300,
        height: 40,
    },
});

export default GameplaySlider;