// C:\Users\marcu\education_app\EducationApp\src\screens\learnerSignup\LearnerDone.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const LearnerDone = () => {
  const navigation = useNavigation();

  const goToDashboard = () => {
    // 가입 후 대시보드로 이동
    navigation.navigate('Dashboard'); // 또는 Home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>가입이 완료되었습니다!</Text>
      <Text style={styles.desc}>
        이제 bzla에서 원하는 레슨이나 컨설팅을 찾아보세요.
      </Text>
      <Button mode="contained" onPress={goToDashboard}>
        대시보드로 이동
      </Button>
    </View>
  );
};

export default LearnerDone;

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
