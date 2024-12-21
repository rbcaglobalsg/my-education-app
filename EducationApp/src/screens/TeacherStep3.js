// C:\Users\marcu\education_app\EducationApp\src\screens\teacherSignup\TeacherStep3.js
import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const TeacherStep3 = () => {
  const navigation = useNavigation();
  const [gender, setGender] = useState('남자');
  const [phone, setPhone] = useState('');

  const onNext = () => {
    // validate...
    navigation.navigate('TeacherDone');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>고수 가입 (마지막)</Text>
      <Text style={styles.label}>성별</Text>
      <View style={styles.genderRow}>
        <Button 
          mode={gender === '남자' ? 'contained' : 'outlined'}
          onPress={() => setGender('남자')}
          style={styles.genderBtn}
        >
          남자
        </Button>
        <Button 
          mode={gender === '여자' ? 'contained' : 'outlined'}
          onPress={() => setGender('여자')}
          style={styles.genderBtn}
        >
          여자
        </Button>
      </View>

      <Text style={styles.label}>휴대전화 번호</Text>
      <TextInput
        placeholder="010-XXXX-XXXX"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <Button mode="contained" onPress={onNext} style={styles.btn}>
        가입 완료
      </Button>
    </View>
  );
};

export default TeacherStep3;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  label: { marginTop: 15, marginBottom: 5 },
  genderRow: { flexDirection: 'row', marginBottom: 15 },
  genderBtn: { marginRight: 10 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 5, 
    padding: 10 
  },
  btn: { marginTop: 30 },
});
