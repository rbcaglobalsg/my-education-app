import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AirbnbRating } from 'react-native-ratings';

const ReviewScreen = ({ route, navigation }) => {
  const { sessionId } = route.params; 
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReview = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No token found');
      return;
    }

    try {
      const response = await fetch('https://bzla.ai/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId,
          rating,
          comment
        })
      });

      if (!response.ok) {
        const text = await response.text();
        console.log('Response text:', text);
        throw new Error('Failed to submit review');
      }

      const result = await response.json();
      Alert.alert('Success', result.message);
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Write a Review</Text>
      <Text>Rate this session:</Text>
      <AirbnbRating
        count={5}
        defaultRating={5}
        size={20}
        onFinishRating={(val) => setRating(val)}
      />

      <TextInput
        mode="outlined"
        label="Comment"
        placeholder="Write your comment..."
        value={comment}
        onChangeText={setComment}
        multiline
        style={{marginVertical:10}}
      />

      <Button mode="contained" onPress={submitReview}>
        Submit Review
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex:1, padding:20, backgroundColor:'#f4f4f9'},
  title: { textAlign:'center', marginBottom:20 }
});

export default ReviewScreen;
