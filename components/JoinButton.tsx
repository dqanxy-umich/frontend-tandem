import React, { useState } from 'react';
import { Button, View, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { io } from 'socket.io-client';

interface JoinButtonProps {
    onJoinSuccess: (timeout:number, userId: number[], ttip:string, isSlider:boolean[]) => void;
    ip: string;
}

const JoinButton: React.FC<JoinButtonProps> = ({ onJoinSuccess, ip }) => {
    const [isDisabled, setIsDisabled] = useState(false);

    const handleJoin = async () => {
        try {
            const socket = io('http://' + ip);

            socket.emit('join', {action: 'join' });

            socket.on('joinSuccess', (response : any) => {
                const userId = response.user_id;
                setIsDisabled(true);
                onJoinSuccess(response.timeout, userId, response.tooltip, response.isSlider);
                socket.disconnect();
            });

            socket.on('connect_error', () => {
                Alert.alert('Error', 'Failed to join. Please try again.');
                socket.disconnect();
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to join. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Button
                title="Join"
                onPress={handleJoin}
                disabled={isDisabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
});

export default JoinButton;