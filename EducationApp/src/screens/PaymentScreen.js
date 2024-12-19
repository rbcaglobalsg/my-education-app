import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = ({ route, navigation }) => {
  const { sessionId, amount } = route.params; 
  // amount는 결제할 금액(예: 2000 = $20.00), 서버나 슬롯 정보에서 가져왔다고 가정

  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    fetchPaymentIntentClientSecret();
  }, []);

  const fetchPaymentIntentClientSecret = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No token found');
      setLoading(false);
      return;
    }

    try {
      // 백엔드에 sessionId, amount를 보내 PaymentIntent 생성 후 client_secret 반환
      const response = await fetch('https://bzla.ai/api/payment_intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId, amount })
      });

      if (!response.ok) {
        const text = await response.text();
        console.log('Response text:', text);
        throw new Error('Failed to create PaymentIntent');
      }

      const data = await response.json();
      const { clientSecret } = data; 

      const initResult = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'My Education App',
      });

      if (initResult.error) {
        Alert.alert('Error', initResult.error.message);
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching PaymentIntent:', error);
      Alert.alert('Error', 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    setLoading(true);
    const { error } = await presentPaymentSheet();
    setLoading(false);

    if (error) {
      Alert.alert('Payment error', error.message);
    } else {
      Alert.alert('Success', 'Your payment is confirmed!');
      // 결제 성공 시 /api/schedule 호출로 예약 확정 로직
      confirmReservation();
    }
  };

  const confirmReservation = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No token found');
      return;
    }

    try {
      const response = await fetch('https://bzla.ai/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify({
          partnerId: route.params.partnerId, 
          date: route.params.date, 
          time: route.params.time
        })
      });

      if (!response.ok) {
        const text = await response.text();
        console.log('Response text:', text);
        throw new Error('Failed to schedule session');
      }

      const result = await response.json();
      Alert.alert('Session Booked', result.message);
      navigation.goBack();
    } catch (error) {
      console.error('Error scheduling session:', error);
      Alert.alert('Error','Failed to schedule session');
    }
  };

  return (
    <View style={{padding:20}}>
      <Text variant="headlineMedium" style={{marginBottom:20}}>Payment</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button mode="contained" onPress={openPaymentSheet}>
          Proceed to Pay
        </Button>
      )}
    </View>
  );
};

export default PaymentScreen;
