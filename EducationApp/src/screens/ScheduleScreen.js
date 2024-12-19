// src/screens/ScheduleScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScheduleScreen = ({ navigation }) => {
    const [partnerId, setPartnerId] = useState('');
    const [date, setDate] = useState('2024-12-10');
    const [time, setTime] = useState('10:00');
    const [loading, setLoading] = useState(false);

    const handleSchedule = async () => {
        if (!partnerId || !date || !time) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'No token found');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://bzla.ai/api/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ partnerId, date, time })
            });

            setLoading(false);
            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Failed to create session');
            }

            const result = await response.json();
            Alert.alert('Success', result.message);
            navigation.navigate('Dashboard'); 
        } catch (error) {
            setLoading(false);
            console.error('Error scheduling session:', error);
            Alert.alert('Error', 'Failed to create session');
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Make a Reservation</Text>
            <TextInput
                mode="outlined"
                label="Partner ID"
                value={partnerId}
                onChangeText={setPartnerId}
                style={styles.input}
            />
            <TextInput
                mode="outlined"
                label="Date (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
                style={styles.input}
            />
            <TextInput
                mode="outlined"
                label="Time (HH:MM)"
                value={time}
                onChangeText={setTime}
                style={styles.input}
            />

            {loading ? <ActivityIndicator size="large" color="#2f80ed" /> : (
                <Button mode="contained" onPress={handleSchedule} style={styles.button}>
                    Submit
                </Button>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9', justifyContent: 'center' },
    title: { textAlign: 'center', marginBottom: 20 },
    input: { marginBottom: 15 },
    button: { marginTop: 10 },
});

export default ScheduleScreen;
