// src/screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const showNotification = (title, message) => {
    PushNotification.localNotification({
        channelId: "default-channel-id",
        title: title,
        message: message,
        playSound: true,
        soundName: "default",
    });
};

const DashboardScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUpcomingSessions = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

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
            const sessions = data.sessions;

            const now = new Date();
            sessions.forEach(s => {
                const sessionDateTime = new Date(`${s.date}T${s.time}:00`);
                const diff = (sessionDateTime - now) / 60000; // 분 단위 차이
                if (diff > 0 && diff <= 10) {
                    showNotification("Upcoming Session", `You have a session starting at ${s.time}`);
                }
            });
        } catch (error) {
            console.error('Error checking sessions for notification:', error);
        }
    };

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

                if (!response.ok) {
                    const text = await response.text();
                    console.log('Response text:', text);
                    throw new Error('Failed to load user info');
                }

                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user info:', error);
                Alert.alert('Error', 'Failed to load user info');
            }
            setLoading(false);
        };

        fetchUserInfo().then(() => {
            checkUpcomingSessions();
        });
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2f80ed" />
            </View>
        );
    }

    if (!userInfo) {
        return (
            <View style={styles.container}>
                <Text variant="headlineSmall">No user info available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Welcome to Dashboard!</Text>
            <Text>Name: {userInfo.name}</Text>
            <Text>Email: {userInfo.email}</Text>
            <Text>Role: {userInfo.role}</Text>

            <Button mode="outlined" onPress={() => navigation.navigate('Profile')} style={{ marginTop: 20 }}>
                Edit Profile
            </Button>
            <Button mode="outlined" onPress={() => navigation.navigate('Search')} style={{ marginTop: 20 }}>
                Search
            </Button>
            <Button mode="outlined" onPress={() => navigation.navigate('Schedule')} style={{ marginTop: 20 }}>
                Make a Reservation
            </Button>
            <Button mode="outlined" onPress={() => navigation.navigate('Reservations')} style={{ marginTop: 20 }}>
                My Reservations
            </Button>
            {userInfo.role === 'teach' && (
                <Button mode="outlined" onPress={() => navigation.navigate('TeacherDashboard')} style={{ marginTop: 20 }}>
                    Teacher Dashboard
                </Button>
            )}

            {/* 로그아웃 버튼 추가 */}
            <Button mode="contained" onPress={handleLogout} style={{ marginTop: 20 }}>
                Logout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f9' },
    title: { marginBottom: 20 },
});

export default DashboardScreen;
