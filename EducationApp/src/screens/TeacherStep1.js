// C:\Users\marcu\education_app\EducationApp\src\screens\teacherSignup\TeacherStep1.js
import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, Button, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const TeacherStep1 = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeAll, setAgreeAll] = useState(false);

  const onNext = () => {
    // validation etc
    navigation.navigate('TeacherStep2');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>고수 가입 (1단계)</Text>
      <View style={styles.inputGroup}>
        <Text>이메일</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          placeholder="example@domain.com"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text>비밀번호</Text>
        <TextInput 
          style={styles.input} 
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호"
        />
      </View>

      <View style={styles.checkGroup}>
        <Checkbox
          status={agreeAll ? 'checked' : 'unchecked'}
          onPress={() => setAgreeAll(!agreeAll)}
        />
        <Text style={{ marginLeft: 8 }}>약관 전체 동의</Text>
      </View>

      <Button mode="contained" onPress={onNext} style={styles.btn}>
        다음
      </Button>
    </View>
  );
};

export default TeacherStep1;

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
  checkGroup: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  btn: { marginTop: 20 },
});
