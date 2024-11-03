import React from 'react';
import { Button, View, StyleSheet, Alert, Pressable } from 'react-native';
import { DefaultEventsMap } from 'socket.io';
import { Socket } from 'socket.io-client';

interface GameplayButtonProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    userId: number;
    isDisabled: boolean;
    ip: string;
}

const GameplayButton: React.FC<GameplayButtonProps> = ({ socket, userId, isDisabled, ip }) => {
    const handlePress = async () => {
        try {
            
            console.log("Sending input");
            console.log(userId);

            socket?.emit('gameplay', {action: 'input', "user_id": userId});
            //socket?.send(JSON.stringify({action: 'input', "user_id": userId}));

            Alert.alert('Success', 'Request sent successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to send request');
        }
    };

    const handleRelease = async () => {
        try {
            console.log("Releasing input");
            console.log(userId);

            socket?.emit('gameplay', {action: 'release', "user_id": userId});

            // const response = await fetch('http://'+ip+'/release', {
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
        }
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={({pressed}) => [
                {
                  backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                  padding: 30
                }
              ]}
                onPressIn={handlePress}
                onPressOut={handleRelease}
                disabled={isDisabled}
            >
                </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
});

export default GameplayButton;