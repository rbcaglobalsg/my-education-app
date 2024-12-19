// src/screens/SignUpScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';

const SignUpScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [interests, setInterests] = useState('');
    const [expertise, setExpertise] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim() || !email.trim() || !password.trim() || !role.trim()) {
            Alert.alert('Error', 'Please fill all required fields (Name, Email, Password, Role)');
            return;
        }
        if (role !== 'learn' && role !== 'teach') {
            Alert.alert('Error', 'Please select a role: Learn or Teach');
            return;
        }

        setLoading(true);

        const dataToSubmit = {
            name,
            email,
            password,
            role,
            interests: role === 'learn' ? interests.split(',').map(i => i.trim()).filter(Boolean) : [],
            expertise: role === 'teach' ? expertise.split(',').map(e => e.trim()).filter(Boolean) : [],
        };

        try {
            const response = await fetch('https://bzla.ai/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSubmit),
            });

            setLoading(false);
            console.log('Status:', response.status);
            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Failed to submit data');
            }

            const result = await response.json();
            Alert.alert('Success', 'Account created successfully!');
            navigation.navigate('Login');
        } catch (error) {
            setLoading(false);
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to create account');
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Sign Up</Text>
            <TextInput
                mode="outlined"
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
            />
            <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <View style={styles.roleSelection}>
                <Button mode={role === 'learn' ? 'contained' : 'outlined'} onPress={() => setRole('learn')}>Learn</Button>
                <Button mode={role === 'teach' ? 'contained' : 'outlined'} onPress={() => setRole('teach')}>Teach</Button>
            </View>

            {role === 'learn' && (
                <TextInput
                    mode="outlined"
                    label="Interests (comma-separated)"
                    value={interests}
                    onChangeText={setInterests}
                    style={styles.input}
                />
            )}

            {role === 'teach' && (
                <TextInput
                    mode="outlined"
                    label="Expertise (comma-separated)"
                    value={expertise}
                    onChangeText={setExpertise}
                    style={styles.input}
                />
            )}

            {loading ? <ActivityIndicator size="large" color="#2f80ed" /> : (
                <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
                    Sign Up
                </Button>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f4f9' },
    title: { textAlign: 'center', marginBottom: 20 },
    input: { marginBottom: 15 },
    roleSelection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    submitButton: { marginTop: 10 },
});

export default SignUpScreen;
