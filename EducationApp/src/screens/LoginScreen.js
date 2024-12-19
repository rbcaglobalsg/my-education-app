// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading]=useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error','Email and password required');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('https://bzla.ai/api/login', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({email,password})
            });
            setLoading(false);
            if(!response.ok) {
                const text = await response.text();
                console.log('Response text:',text);
                throw new Error('Login failed');
            }
            const result = await response.json();
            Alert.alert('Success', result.message);
            // 토큰 저장
            const data = result; // {message, token}
            await AsyncStorage.setItem('token', data.token);
            navigation.navigate('Dashboard');
        } catch(error) {
            console.error('Login error:',error);
            Alert.alert('Error','Failed to login');
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Login</Text>
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
            {loading?<ActivityIndicator size="large" color="#2f80ed"/>:(
                <>
                <Button mode="contained" onPress={handleLogin} style={styles.button}>Login</Button>
                <Button mode="text" onPress={()=>navigation.navigate('SignUp')}>Sign Up</Button>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container:{flex:1,justifyContent:'center',padding:20,backgroundColor:'#f4f4f9'},
    title:{textAlign:'center',marginBottom:20},
    input:{marginBottom:15},
    button:{marginBottom:10}
});

export default LoginScreen;
