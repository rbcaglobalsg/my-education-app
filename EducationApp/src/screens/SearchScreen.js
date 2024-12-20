// src/screens/SearchScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { Text, TextInput, Button, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SearchScreen = () => {
    const [keyword, setKeyword] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('Monday');
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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
            const response = await fetch(`https://bzla.ai/api/availability?dayOfWeek=${encodeURIComponent(dayOfWeek)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Failed to load availability');
            }

            const data = await response.json();
            const interestLower = keyword.toLowerCase();

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

    const getTeacherInfo = (teacherId) => {
        return teachers.find(t => t.id === teacherId);
    };

    const openTeacherDetail = (teacher) => {
        setSelectedTeacher(teacher);
        setModalVisible(true);
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
                        <TouchableOpacity key={t.id} onPress={() => openTeacherDetail(t)}>
                            <List.Item
                                title={t.name}
                                description={`Email: ${t.email}\nRole: ${t.role}\nInterests: ${t.interests}\nExpertise: ${t.expertise}`}
                                left={props => t.profileImage ? <Image source={{uri: t.profileImage}} style={{width:50,height:50,borderRadius:25}}/> : <List.Icon {...props} icon="account" />}
                            />
                        </TouchableOpacity>
                    ))}

                    {slots.map(s => {
                        const teacher = getTeacherInfo(s.teacherId);
                        const teacherName = teacher ? teacher.name : 'Unknown';
                        return (
                            <TouchableOpacity key={s.id} onPress={() => teacher && openTeacherDetail(teacher)}>
                                <List.Item
                                    title={`${teacherName} - ${s.dayOfWeek} at ${s.time}`}
                                    description={`Duration: ${s.duration} min, Price: $${s.price}, Status: ${s.status}`}
                                    left={props => teacher && teacher.profileImage ? <Image source={{uri: teacher.profileImage}} style={{width:50,height:50,borderRadius:25}}/> : <List.Icon {...props} icon="calendar-clock" />}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            {!loading && teachers.length === 0 && slots.length === 0 && (
                <Text style={{ marginTop: 20 }}>No results. Try another keyword or day.</Text>
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedTeacher && (
                            <>
                                {selectedTeacher.profileImage ? (
                                    <Image source={{uri: selectedTeacher.profileImage}} style={{width:100,height:100,borderRadius:50,marginBottom:10}}/>
                                ) : null}
                                <Text variant="headlineSmall">{selectedTeacher.name}</Text>
                                <Text>{selectedTeacher.email}</Text>
                                <Text>Role: {selectedTeacher.role}</Text>
                                <Text>Interests: {selectedTeacher.interests}</Text>
                                <Text>Expertise: {selectedTeacher.expertise}</Text>
                                <Text style={{marginTop:10}}>{selectedTeacher.bio}</Text>

                                <Button mode="contained" onPress={() => setModalVisible(false)} style={{marginTop:15}}>Close</Button>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9' },
    title: { textAlign: 'center', marginBottom: 20 },
    input: { marginBottom: 15 },
    button: { marginBottom: 15 },
    modalContainer: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width:'80%',
        backgroundColor:'#fff',
        padding:20,
        borderRadius:10,
        alignItems:'center'
    }
});

export default SearchScreen;
