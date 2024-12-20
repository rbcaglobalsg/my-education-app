// src/screens/SearchScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Text, TextInput, Button, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SearchScreen = () => {
    const [keyword, setKeyword] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('Monday');
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const handleSearch = async () => {
        if (!keyword.trim()) {
            Alert.alert('Error', 'Please enter a search keyword');
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
            // dayOfWeek 기반으로 slot/teacher 조회
            const response = await fetch(`https://bzla.ai/api/availability?dayOfWeek=${encodeURIComponent(dayOfWeek)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Failed to load availability');
            }

            const data = await response.json();
            // data = { slots: [...], teachers: [...] }
            const interestLower = keyword.toLowerCase();

            // 키워드를 teacher의 interests나 expertise에서 찾는다.
            const filteredTeachers = data.teachers.filter(t => {
                const tInterests = (t.interests || '').toLowerCase();
                const tExpertise = (t.expertise || '').toLowerCase();
                return tInterests.includes(interestLower) || tExpertise.includes(interestLower);
            });

            const filteredTeacherIds = filteredTeachers.map(t => t.id);

            const filteredSlots = data.slots.filter(s => filteredTeacherIds.includes(s.teacherId));

            setTeachers(filteredTeachers);
            setSlots(filteredSlots);

        } catch (error) {
            console.error('Error searching:', error);
            Alert.alert('Error', 'Failed to search');
        }
        setLoading(false);
    };

    const getTeacherName = (teacherId) => {
        const t = teachers.find(t=>t.id === teacherId);
        return t ? t.name : 'Unknown Teacher';
    };

    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Search</Text>

            <TextInput
                mode="outlined"
                label="Keyword"
                value={keyword}
                onChangeText={setKeyword}
                style={styles.input}
                placeholder="e.g., Piano"
            />

            <Text variant="titleSmall" style={{ marginBottom: 10 }}>Select Day of Week</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:15}}>
                {DAYS.map(d => (
                    <Button
                        key={d}
                        mode={dayOfWeek===d?'contained':'outlined'}
                        onPress={()=>setDayOfWeek(d)}
                        style={{marginRight:5,marginBottom:5}}
                    >
                        {d}
                    </Button>
                ))}
            </View>

            <Button mode="contained" onPress={handleSearch} style={styles.button}>Search</Button>

            {loading && <ActivityIndicator size="large" color="#2f80ed" style={{ marginTop: 20 }} />}

            {!loading && (teachers.length > 0 || slots.length > 0) && (
                <View style={{ marginTop: 20, width: '100%' }}>
                    <Text variant="titleLarge" style={{ marginBottom:10 }}>Results:</Text>
                    {teachers.map(t => (
                        <List.Item
                            key={t.id}
                            title={t.name}
                            description={`Email: ${t.email}\nRole: ${t.role}\nInterests: ${t.interests}\nExpertise: ${t.expertise}`}
                            left={props => <List.Icon {...props} icon="account" />}
                        />
                    ))}

                    {slots.map(s => (
                        <List.Item
                            key={s.id}
                            title={`${getTeacherName(s.teacherId)} - ${s.dayOfWeek} at ${s.time}`}
                            description={`Duration: ${s.duration} min, Price: $${s.price}, Status: ${s.status}`}
                            left={props => <List.Icon {...props} icon="calendar-clock" />}
                        />
                    ))}
                </View>
            )}

            {!loading && teachers.length === 0 && slots.length === 0 && (
                <Text style={{ marginTop: 20 }}>No results. Try another keyword or day.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9' },
    title: { textAlign: 'center', marginBottom: 20 },
    input: { marginBottom: 15 },
    button: { marginBottom: 15 },
});

export default SearchScreen;
