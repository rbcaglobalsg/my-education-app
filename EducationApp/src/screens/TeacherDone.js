// C:\Users\marcu\education_app\EducationApp\src\screens\teacherSignup\TeacherDone.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const TeacherDone = () => {
  const navigation = useNavigation();
  
  const onGoDashboard = () => {
    // 가입 완료 -> Teacher 대시보드로
    navigation.navigate('Dashboard'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>가입 완료</Text>
      <Text style={styles.desc}>
        이제 bzla에서 고수로 활동하실 수 있습니다.
      </Text>
      <Button mode="contained" onPress={onGoDashboard}>
        대시보드로 이동
      </Button>
    </View>
  );
};

export default TeacherDone;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  desc: { fontSize: 14, color: '#555', marginBottom: 20, textAlign: 'center', lineHeight: 20 },
});
