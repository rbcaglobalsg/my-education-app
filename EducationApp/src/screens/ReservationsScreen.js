// ReservationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text, Button, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReservationsScreen = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No token found, please login again.');
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
        throw new Error('Failed to fetch reservations');
      }

      const data = await response.json();
      setSessions(data.sessions);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      Alert.alert('Error', 'Failed to load reservations');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>My Reservations</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2f80ed" />
      ) : (
        sessions.length === 0 ? (
          <Text>No sessions found.</Text>
        ) : (
          sessions.map(s => (
            <List.Item
              key={s.id}
              title={`Session on ${s.date} at ${s.time}`}
              description={`Status: ${s.status}, Partner: ${s.partnerId === 'currentUserId'? 'You' : s.partnerId}`}
            />
          ))
        )
      )}
      <Button mode="contained" onPress={fetchReservations} style={styles.button}>
        Refresh
      </Button>
    </View>
  );
};

const styles = {
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9' },
  title: { textAlign: 'center', marginBottom: 20 },
  button: { marginTop: 10 },
};

export default ReservationsScreen;
