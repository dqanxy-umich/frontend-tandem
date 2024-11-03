import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import JoinButton from '@/components/JoinButton';
import { useState } from 'react';
import { useEffect } from 'react';
import GameplayButton from '@/components/GameplayButton';
import { TextInput } from 'react-native';
import GameplaySlider from '@/components/GameplaySlider';
import { io } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io';
import { Socket } from 'socket.io-client';

export default function HomeScreen() {
  const [userId, setUserId] = useState<number[]>([]);
  const [timeout, setTimeoutt] = useState<number>(-1);
  const [gameplayEnabled, setGameplayEnabled] = useState(false);
  const [ip, setIp] = useState("INPUT IP");
  const [toolTip, setToolTip] = useState("Input IP and press Join to start");
  const [isSlider, setIsSlider] = useState<boolean[]>([]);
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null> (null);

  function initSocket() {
    setSocket(io('http://' + ip));

    if (socket) {
      socket.on("connect", () => {
        console.log('Socket connection established');
      });

      
      socket.on("message", () => {
        console.log('Socket connection established');
      });

      socket.on("connect_error", () => {
        console.log('Socket connection error');
      });
      // socket.onerror = (error) => {
      //   console.error('Socket encountered error: ', error);
      // };

      socket.on("disconnect",() => {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.');
        setTimeout(() => {
          initSocket();
        }, 1000);
      } );

    }
  }

  useEffect(() => {
    let heartbeatInterval: NodeJS.Timeout;

    if (socket) {
      heartbeatInterval = setInterval(() => {
          socket.emit("heartbeat",{ type: 'heartbeat', timeout: timeout });
          console.log('Heartbeat sent');
      }, 3000);
    }

    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [socket]);

  function init(timeout:number, uid:number[], ttip:string, isSlider:boolean[]) {
    initSocket()
    setTimeoutt(timeout)
    setUserId(uid)
    setToolTip(ttip)
    setGameplayEnabled(true)
    setIsSlider(isSlider)
    console.log("Initializing with user id: " + uid);
  }


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, padding: 8, color: 'white' }}
          onChangeText={text => setIp(text)}
          value={ip}
        />
        <JoinButton onJoinSuccess={init} ip={ip}/>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText>{userId}</ThemedText>
        <ThemedText>{toolTip}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {userId.map((item, index) => (
        isSlider[index] ? (
          <GameplaySlider key={item} socket={socket} userId={item} isDisabled={!gameplayEnabled} ip={ip} />
        ) : (
          <GameplayButton key={item} socket={socket} userId={item} isDisabled={!gameplayEnabled} ip={ip} />
        )
      ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});