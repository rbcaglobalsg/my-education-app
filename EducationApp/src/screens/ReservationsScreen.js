// ReservationsScreen.js (예시)
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text, Button, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error','No token found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://bzla.ai/api/schedule', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const text = await response.text();
        console.log('Response text:', text);
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      setSessions(data.sessions); 
    } catch (error) {
      console.error('Error fetching sessions:', error);
      Alert.alert('Error','Failed to load sessions');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // 가정: sessions 배열에 {id, userId, partnerId, date, time, status} 형태
  // status가 "Completed"인 경우 리뷰 작성 가능
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>My Sessions</Text>
      {loading ? <ActivityIndicator size="large" color="#2f80ed" /> : (
        sessions.length === 0 ? (
          <Text>No sessions found.</Text>
        ) : (
          sessions.map(s => (
            <List.Item
              key={s.id}
              title={`Session with ${s.partnerId} on ${s.date} at ${s.time}`}
              description={`Status: ${s.status}`}
              right={props => (
                s.status === 'Completed' ? (
                  <Button mode="text" onPress={() => navigation.navigate('Review', { sessionId: s.id })}>
                    Write Review
                  </Button>
                ) : null
              )}
            />
          ))
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex:1, padding:20, backgroundColor:'#f4f4f9'},
  title: {textAlign:'center', marginBottom:20},
});

export default ReservationsScreen;
