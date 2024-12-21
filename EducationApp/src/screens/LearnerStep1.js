// C:\Users\marcu\education_app\EducationApp\src\screens\learnerSignup\LearnerStep1.js
import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, Button, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const LearnerStep1 = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 약관 동의 체크
  const [agreeAll, setAgreeAll] = useState(false);
  // etc...

  const onNext = () => {
    // 간단 검증 후 넘어감
    if (!email || !password) {
      // TODO: validation
      return;
    }
    navigation.navigate('LearnerStep2');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>학습자 가입 (1단계)</Text>
      
      <View style={styles.inputGroup}>
        <Text>이메일</Text>
        <TextInput
          placeholder="example@domain.com"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text>비밀번호</Text>
        <TextInput
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
      </View>

      <View style={styles.checkGroup}>
        <Checkbox
          status={agreeAll ? 'checked' : 'unchecked'}
          onPress={() => setAgreeAll(!agreeAll)}
        />
        <Text style={{ marginLeft: 8 }}>약관 전체 동의</Text>
      </View>
      {/* 필요한 약관 항목들 추가 */}

      <Button mode="contained" onPress={onNext} style={styles.btn}>
        다음
      </Button>
    </View>
  );
};

export default LearnerStep1;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  inputGroup: { marginVertical: 10 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 5, 
    padding: 10, 
    marginTop: 5 
  },
  checkGroup: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 10 
  },
  btn: { marginTop: 20 },
});
