// src/screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [interests, setInterests] = useState('');
    const [expertise, setExpertise] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No token found');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('https://bzla.ai/api/userinfo', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to load user info');
                const data = await response.json();

                setName(data.name || '');
                // interests와 expertise는 서버에서 ','로 join된 문자열 형태라고 가정
                // 실제 서버 로직에 따라 맞춰줘야 함
                // Airtable에 저장된 데이터가 "Piano, Math" 형태라면 split(',')
                setInterests(data.role === 'learn' && data.Interests ? data.Interests : '');
                setExpertise(data.role === 'teach' && data.Expertise ? data.Expertise : '');

            } catch (error) {
                console.error('Error fetching user info:', error);
                Alert.alert('Error', 'Failed to load user info');
            }
            setLoading(false);
        };

        fetchUserInfo();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'No token found');
            setLoading(false);
            return;
        }

        // interests, expertise를 배열 형태로 서버에 전달
        const interestsArr = interests ? interests.split(',').map(i => i.trim()) : [];
        const expertiseArr = expertise ? expertise.split(',').map(e => e.trim()) : [];

        try {
            const response = await fetch('https://bzla.ai/api/userinfo', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, interests: interestsArr, expertise: expertiseArr })
            });

            setLoading(false);
            if (!response.ok) throw new Error('Failed to update user info');

            const result = await response.json();
            Alert.alert('Success', result.message);
            navigation.goBack();
        } catch (error) {
            setLoading(false);
            console.error('Error updating user info:', error);
            Alert.alert('Error', 'Failed to update info');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2f80ed" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Edit Profile</Text>
            <TextInput
                mode="outlined"
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                mode="outlined"
                label="Interests (for learners)"
                value={interests}
                onChangeText={setInterests}
                style={styles.input}
            />
            <TextInput
                mode="outlined"
                label="Expertise (for teachers)"
                value={expertise}
                onChangeText={setExpertise}
                style={styles.input}
            />
            <Button mode="contained" onPress={handleSave}>
                Save
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f4f9' },
    title: { textAlign: 'center', marginBottom: 20 },
    input: { marginBottom: 15 },
});

export default ProfileScreen;
