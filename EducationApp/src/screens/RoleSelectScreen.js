// C:\Users\marcu\education_app\EducationApp\src\screens\RoleSelectScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const RoleSelectScreen = () => {
  const navigation = useNavigation();

  const goToLearnerSignup = () => {
    navigation.navigate('LearnerSignupStack');
  };

  const goToTeacherSignup = () => {
    navigation.navigate('TeacherSignupStack');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>고객과 고수를 잇다, 안녕하세요! bzla입니다.</Text>
      <Text style={styles.subtitle}>
        1,000가지 서비스가 있는 bzla에서<br />고객(학습자)과 고수를 만나보세요.
      </Text>

      <Button 
        mode="contained" 
        onPress={goToLearnerSignup} 
        style={styles.btn}
      >
        학습자로 시작
      </Button>

      <Button 
        mode="outlined" 
        onPress={goToTeacherSignup} 
        style={styles.btn}
      >
        고수로 시작
      </Button>
    </View>
  );
};

export default RoleSelectScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { 
    fontSize: 14, 
    color: '#555', 
    marginBottom: 20, 
    textAlign: 'center', 
    lineHeight: 20 
  },
  btn: { marginVertical: 5, width: '80%' },
});
