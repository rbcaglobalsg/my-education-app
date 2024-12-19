// src/screens/TeacherDashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text, TextInput, Button, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TeacherDashboardScreen = () => {
    const [dayOfWeek, setDayOfWeek] = useState('Monday');
    const [time, setTime] = useState('10:00');
    const [duration, setDuration] = useState('60');
    const [price, setPrice] = useState('50');
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);

    const fetchSlots = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'No token found');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://bzla.ai/api/teacher/availability', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Failed to fetch slots');
            }

            const data = await response.json();
            setSlots(data.slots);
        } catch (error) {
            console.error('Error fetching slots:', error);
            Alert.alert('Error', 'Failed to load slots');
        }
        setLoading(false);
    };

    const addSlot = async () => {
        if (!dayOfWeek || !time || !duration || !price) {
            Alert.alert('Error', 'All fields are required');
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
            const response = await fetch('http://bzla.ai/api/teacher/availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ dayOfWeek, time, duration, price })
            });

            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Failed to add slot');
            }

            const result = await response.json();
            Alert.alert('Success', result.message);
            fetchSlots();
        } catch (error) {
            console.error('Error adding slot:', error);
            Alert.alert('Error', 'Failed to add slot');
        }
        setLoading(false);
    };

    const deleteSlot = async (slotId) => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'No token found');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`https://bzla.ai/api/teacher/availability/${slotId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Failed to delete slot');
            }

            const result = await response.json();
            Alert.alert('Success', result.message);
            fetchSlots();
        } catch (error) {
            console.error('Error deleting slot:', error);
            Alert.alert('Error', 'Failed to delete slot');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Teacher Dashboard</Text>
            <Text variant="titleSmall">Day of Week</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:15}}>
                {DAYS.map(d => (
                    <Button key={d} mode={dayOfWeek===d?'contained':'outlined'} onPress={()=>setDayOfWeek(d)} style={{marginRight:5,marginBottom:5}}>
                        {d}
                    </Button>
                ))}
            </View>

            <TextInput mode="outlined" label="Time (HH:MM)" value={time} onChangeText={setTime} style={styles.input} />
            <TextInput mode="outlined" label="Duration (minutes)" value={duration} onChangeText={setDuration} keyboardType="numeric" style={styles.input} />
            <TextInput mode="outlined" label="Price (USD)" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} />

            {loading ? <ActivityIndicator size="large" color="#2f80ed" /> : (
                <Button mode="contained" onPress={addSlot} style={styles.button}>
                    Add Slot
                </Button>
            )}

            <Text variant="titleLarge" style={{ marginTop: 20 }}>My Slots</Text>
            {slots.length === 0 ? (
                <Text>No slots found.</Text>
            ) : (
                slots.map(s => (
                    <List.Item
                        key={s.id}
                        title={`Day: ${s.dayOfWeek}, Time: ${s.time}`}
                        description={`Duration: ${s.duration} min, Price: $${s.price}, Status: ${s.status}`}
                        right={props => (
                            <Button mode="text" onPress={() => deleteSlot(s.id)}>Delete</Button>
                        )}
                    />
                ))
            )}
        </View>
    );
};

const styles = {
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9' },
    title: { textAlign: 'center', marginBottom: 20 },
    input: { marginBottom: 15 },
    button: { marginTop: 10 },
};

export default TeacherDashboardScreen;
