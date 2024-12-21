// C:\Users\marcu\education_app\EducationApp\src\screens\learnerSignup\LearnerStep2.js
import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const LearnerStep2 = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const onSendCode = () => {
    // 휴대전화 번호 -> 서버로 인증 요청
    console.log('send sms code to phone:', phone);
  };

  const onVerify = () => {
    // 인증 코드 확인 후, 완료화면으로
    navigation.navigate('LearnerDone');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>학습자 가입 (마지막 단계)</Text>
      <Text>휴대전화 인증</Text>

      <TextInput
        placeholder="010-1234-5678"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      <Button mode="outlined" onPress={onSendCode} style={styles.btn}>
        전송
      </Button>

      <TextInput
        placeholder="인증코드 입력"
        value={code}
        onChangeText={setCode}
        style={styles.input}
      />
      <Button mode="contained" onPress={onVerify} style={styles.btn}>
        가입 완료
      </Button>
    </View>
  );
};

export default LearnerStep2;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 5, 
    padding: 10, 
    marginVertical: 5 
  },
  btn: { marginVertical: 10 },
});
