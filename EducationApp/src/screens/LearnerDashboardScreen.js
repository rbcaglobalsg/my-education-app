// src/screens/LearnerDashboardScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { Text, Button, List, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const DAYS_ARR = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function getDayOfWeekFromDate(date) {
    const dayIndex = date.getDay(); // 0: Sunday, 1: Monday, ...
    return DAYS_ARR[dayIndex]; 
}

const LearnerDashboardScreen = () => {
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [topic, setTopic] = useState('');

    // 날짜 선택 관련 상태
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const searchByTopic = async () => {
        if (!topic.trim()) {
            Alert.alert('Error', 'Please enter a topic');
            return;
        }

        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error','No token found');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`https://bzla.ai/api/search?interests=${encodeURIComponent(topic)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Failed to search by topic');
            }

            const data = await response.json();
            // 주제 검색 결과는 teachers만 반환
            setTeachers(data.results);
            setSlots([]);
        } catch (error) {
            console.error('Error searching by topic:', error);
            Alert.alert('Error','Failed to search by topic');
        }
        setLoading(false);
    };

    const searchAvailabilityByDate = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error','No token found');
            setLoading(false);
            return;
        }

        const dayOfWeek = getDayOfWeekFromDate(selectedDate);
        try {
            const response = await fetch(`https://bzla.ai/api/availability?dayOfWeek=${dayOfWeek}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Failed to fetch availability');
            }

            const data = await response.json();
            setSlots(data.slots);
            setTeachers(data.teachers);
        } catch (error) {
            console.error('Error fetching availability:', error);
            Alert.alert('Error','Failed to load availability');
        }
        setLoading(false);
    };

    const reserveSlot = async (slot) => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error','No token found');
            return;
        }

        // date는 이미 selectedDate 있음. slot.dayOfWeek로 날짜를 맞추는 대신 selectedDate 사용.
        // 하지만 서버 예약 로직 상 dayOfWeek를 기반으로 date를 계산하던 기존 로직 폐기.
        // 여기서는 selectedDate 자체를 예약 날짜로 사용.
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth()+1).padStart(2,'0');
        const day = String(selectedDate.getDate()).padStart(2,'0');
        const dateStr = `${year}-${month}-${day}`;

        try {
            const response = await fetch('https://bzla.ai/api/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body: JSON.stringify({
                    partnerId: slot.teacherId,
                    date: dateStr,
                    time: slot.time
                })
            });

            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Failed to schedule session');
            }

            const result = await response.json();
            Alert.alert('Success', result.message);
        } catch (error) {
            console.error('Error scheduling session:', error);
            Alert.alert('Error','Failed to schedule session');
        }
    };

    const getTeacherName = (teacherId) => {
        const t = teachers.find(t=>t.id===teacherId);
        return t ? t.name : 'Unknown Teacher';
    };

    const onChangeDate = (event, selected) => {
        setShowDatePicker(false);
        if (selected) {
            setSelectedDate(selected);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Learner Dashboard</Text>
            
            {/* 주제 검색 */}
            <Text variant="titleSmall">Enter Topic (e.g., Math, Piano)</Text>
            <TextInput
                mode="outlined"
                value={topic}
                onChangeText={setTopic}
                placeholder="e.g., Piano"
                style={{marginBottom:10}}
            />
            {loading ? <ActivityIndicator size="large" color="#2f80ed" /> : (
                <Button mode="contained" onPress={searchByTopic} style={styles.button}>
                    Search By Topic
                </Button>
            )}

            <Text variant="titleSmall" style={{marginTop:20}}>Select Date</Text>
            <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={{marginBottom:10}}>
                {`Selected: ${selectedDate.toDateString()}`}
            </Button>
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    onChange={onChangeDate}
                />
            )}

            {loading ? <ActivityIndicator size="large" color="#2f80ed" /> : (
                <Button mode="contained" onPress={searchAvailabilityByDate} style={styles.button}>
                    Search By Date
                </Button>
            )}

            <Text variant="titleLarge" style={{ marginTop: 20 }}>Results</Text>
            {teachers.length === 0 && slots.length === 0 ? (
                <Text>No results found.</Text>
            ) : (
                <>
                    {teachers.length > 0 && slots.length === 0 && (
                        <>
                            <Text>Teachers (Topic-based search):</Text>
                            {teachers.map(t => (
                                <List.Item
                                    key={t.id}
                                    title={t.name}
                                    description={`Interests: ${t.interests}\nExpertise: ${t.expertise}`}
                                />
                            ))}
                        </>
                    )}

                    {slots.length > 0 && (
                        <>
                            <Text style={{marginTop:20}}>Available Slots (Date-based):</Text>
                            {slots.map(s => (
                                <List.Item
                                    key={s.id}
                                    title={`${getTeacherName(s.teacherId)} - ${s.dayOfWeek} at ${s.time}`}
                                    description={`Duration: ${s.duration} min, Price: $${s.price}, Status: ${s.status}`}
                                    right={props => (
                                        <Button mode="text" onPress={() => reserveSlot(s)}>Reserve</Button>
                                    )}
                                />
                            ))}
                        </>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9' },
    title: { textAlign: 'center', marginBottom: 20 },
    button: { marginTop: 10 },
});

export default LearnerDashboardScreen;
