// src/screens/SearchScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () => {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

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

        // interests에 keyword를 넣어 검색. 필요하다면 expertise로도 검색 가능.
        const url = `https://bzla.ai/api/search?interests=${encodeURIComponent(keyword.toLowerCase())}`;

        try {
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const text = await response.text();
                console.log('Response text:', text);
                throw new Error('Search failed');
            }

            const data = await response.json();
            setResults(data.results);
        } catch (error) {
            console.error('Error searching:', error);
            Alert.alert('Error', 'Failed to search');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>Search</Text>
            <TextInput
                mode="outlined"
                label="Keyword"
                value={keyword}
                onChangeText={setKeyword}
                style={styles.input}
            />
            <Button mode="contained" onPress={handleSearch} style={styles.button}>Search</Button>

            {loading && <ActivityIndicator size="large" color="#2f80ed" style={{ marginTop: 20 }} />}

            {!loading && results.length > 0 && (
                <View style={{ marginTop: 20, width: '100%' }}>
                    <Text variant="titleLarge">Results:</Text>
                    {results.map(r => (
                        <List.Item
                            key={r.id}
                            title={r.name}
                            description={`Email: ${r.email} | Role: ${r.role} | Interests: ${r.interests} | Expertise: ${r.expertise}`}
                            left={props => <List.Icon {...props} icon="account" />}
                        />
                    ))}
                </View>
            )}

            {!loading && results.length === 0 && (
                <Text style={{ marginTop: 20 }}>No results yet. Try searching!</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f4f4f9' },
    title: { textAlign: 'center', marginBottom: 20 },
    input: { marginBottom: 15 },
    button: { marginBottom: 15 },
});

export default SearchScreen;
