import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, mediaDevices, RTCView } from 'react-native-webrtc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

interface SessionScreenProps {
  route: {
    params: {
      sessionId: string;
      partnerId: string;
      date: string;   // "YYYY-MM-DD"
      time: string;   // "HH:MM"
      token?: string; // optional if not using AsyncStorage
    };
  };
  navigation: any;
}

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }, 
    // 필요 시 TURN 서버 추가: { urls: 'turn:turn.yourserver.com:3478', username: '...', credential: '...' }
  ]
};

const SessionScreen: React.FC<SessionScreenProps> = ({ route, navigation }) => {
  const { sessionId, partnerId, date, time } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState(false);

  const pc = useRef(new RTCPeerConnection(configuration)).current;
  const socketRef = useRef<any>(null);

  useEffect(() => {
    initSession();
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    pc.close();
    pc.onaddstream = null;
    pc.onicecandidate = null;
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
  };

  const initSession = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found, please login again');
        navigation.navigate('Login');
        return;
      }

      // 시그널링 서버 연결
      socketRef.current = io('wss://your-signaling-server.com', {
        transports: ['websocket'],
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });

      socketRef.current.on('connect', () => {
        console.log('Signaling server connected');
        socketRef.current.emit('join', { sessionId });
      });

      socketRef.current.on('joined', () => {
        console.log(`Joined session ${sessionId}`);
        startLocalStream();
      });

      socketRef.current.on('offer', handleOffer);
      socketRef.current.on('answer', handleAnswer);
      socketRef.current.on('iceCandidate', handleCandidate);

      socketRef.current.on('disconnect', () => {
        console.log('Signaling server disconnected');
      });
      
    } catch (error) {
      console.error('Error initializing session:', error);
      Alert.alert('Error', 'Failed to initialize session');
      navigation.goBack();
    }
  };

  const startLocalStream = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      pc.addStream(stream);

      pc.onaddstream = (event) => {
        console.log('Remote stream added');
        setRemoteStream(event.stream);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('iceCandidate', { candidate: event.candidate, sessionId });
        }
      };

      setLoading(false);
    } catch (error) {
      console.error('Error accessing camera/mic:', error);
      Alert.alert('Error', 'Cannot access camera or microphone');
      navigation.goBack();
    }
  };

  const createOffer = async () => {
    try {
      const offer = await pc.createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 1 });
      await pc.setLocalDescription(offer);
      socketRef.current.emit('offer', { sdp: offer, sessionId });
    } catch (error) {
      console.error('Error creating offer:', error);
      Alert.alert('Error', 'Failed to start call');
    }
  };

  const handleOffer = async ({ sdp }) => {
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current.emit('answer', { sdp: answer, sessionId });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async ({ sdp }) => {
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      setConnected(true);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleCandidate = async ({ candidate }) => {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  };

  const endCall = () => {
    cleanup();
    Alert.alert('Call ended');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{color:'#fff',marginTop:10}}>Preparing session...</Text>
        </View>
      )}
      {!loading && (
        <>
          <View style={styles.streamContainer}>
            {localStream && <RTCView streamURL={localStream.toURL()} style={styles.video} />}
            {remoteStream ? (
              <RTCView streamURL={remoteStream.toURL()} style={styles.video} />
            ) : (
              <View style={[styles.video, {alignItems:'center',justifyContent:'center'}]}>
                <Text style={{color:'#fff'}}>Waiting for partner...</Text>
              </View>
            )}
          </View>
          <View style={styles.buttons}>
            {!connected && (
              <Button mode="contained" onPress={createOffer} style={{marginRight:10}}>
                Start Call
              </Button>
            )}
            <Button mode="contained" onPress={endCall} color="red">
              End Call
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#000' },
  loadingOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor:'rgba(0,0,0,0.7)', 
    justifyContent:'center', 
    alignItems:'center' 
  },
  streamContainer: { flex:1, flexDirection:'row' },
  video: { flex:1, backgroundColor:'#444' },
  buttons: { flexDirection:'row', justifyContent:'center', padding:10, backgroundColor:'#222' }
});

export default SessionScreen;
