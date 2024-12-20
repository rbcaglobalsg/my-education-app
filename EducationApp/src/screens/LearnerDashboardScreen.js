// src/screens/LearnerDashboardScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, Button, List, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const LearnerDashboardScreen = ({ navigation }) => {
    const [dayOfWeek, setDayOfWeek] = useState('Monday');
    const [interest, setInterest] = useState('');
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
    };

    const searchAvailability = async () => {
        if (!interest) {
            Alert.alert('Error', 'Please enter an interest/topic to search');
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
            // 1) dayOfWeek 기반으로 모든 교사와 슬롯 조회
            const response = await fetch(`https://bzla.ai/api/availability?dayOfWeek=${dayOfWeek}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Failed to load availability');
            }

            const data = await response.json();
            // data: { slots: [...], teachers: [...] }

            // 2) teachers 중에서 interest(사용자가 입력한 키워드)를 포함하는 교사만 필터
            //    teacher.interests 혹은 teacher.expertise 문자열에 사용자가 입력한 interest가 포함되어 있는지 확인
            const interestLower = interest.toLowerCase();
            const filteredTeachers = data.teachers.filter(t => {
                const teacherInterests = (t.interests || '').toLowerCase();
                const teacherExpertise = (t.expertise || '').toLowerCase();
                return teacherInterests.includes(interestLower) || teacherExpertise.includes(interestLower);
            });

            // 3) 필터된 교사들의 id 목록 추출
            const filteredTeacherIds = filteredTeachers.map(t => t.id);

            // 4) slots 중에서 해당 교사 id를 가진 슬롯만 필터링
            const filteredSlots = data.slots.filter(s => filteredTeacherIds.includes(s.teacherId));

            setSlots(filteredSlots);
            setTeachers(filteredTeachers);

        } catch (error) {
            console.error('Error fetching availability:', error);
            Alert.alert('Error','Failed to load availability');
        }
        setLoading(false);
    };

    const getTeacherName = (teacherId) => {
        const t = teachers.find(t=>t.id===teacherId);
        return t ? t.name : 'Unknown Teacher';
    };

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text variant="headlineMedium" style={styles.title}>Learner Dashboard</Text>
                <Button mode="outlined" onPress={handleLogout} style={{margin:5}}>Logout</Button>
            </View>
            
            <Text variant="titleSmall">Enter interest/topic:</Text>
            <TextInput 
                mode="outlined"
                label="Interest (e.g., Piano, Math)"
                value={interest}
                onChangeText={setInterest}
                style={{marginBottom:15}}
            />
            
            <Text variant="titleSmall">Select Day of Week</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:15}}>
                {DAYS.map(d => (
                    <Button key={d} mode={dayOfWeek===d?'contained':'outlined'} onPress={()=>setDayOfWeek(d)} style={{marginRight:5,marginBottom:5}}>
                        {d}
                    </Button>
                ))}
            </View>

            {loading ? <ActivityIndicator size="large" color="#2f80ed" /> : (
                <Button mode="contained" onPress={searchAvailability} style={styles.button}>
                    Search
                </Button>
            )}

            <Text variant="titleLarge" style={{ marginTop: 20 }}>Available Slots for "{interest}" on {dayOfWeek}</Text>
            {slots.length === 0 ? (
                <Text>No slots found for the given interest and day.</Text>
            ) : (
                slots.map(s => (
                    <List.Item
                        key={s.id}
                        title={`${getTeacherName(s.teacherId)} - ${s.dayOfWeek} at ${s.time}`}
                        description={`Duration: ${s.duration} min, Price: $${s.price}, Status: ${s.status}`}
                        right={props => (
                            // 이후 예약 버튼 추가 시 여기에
                            <Button mode="text">Reserve</Button>
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
    button: { marginTop: 10 },
};

export default LearnerDashboardScreen;
