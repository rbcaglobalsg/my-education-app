// C:\Users\marcu\education_app\EducationApp\src\screens\AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import RoleSelectScreen from './RoleSelectScreen';

// 학습자 스택
import LearnerSignupStack from './learnerSignup/LearnerSignupStack';
// 고수(Teacher) 스택
import TeacherSignupStack from './teacherSignup/TeacherSignupStack';

// 이미 존재하는 화면들
import DashboardScreen from './DashboardScreen';
import LoginScreen from './LoginScreen';
// etc...

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen 
        name="RoleSelect" 
        component={RoleSelectScreen}
        options={{ title: '역할 선택' }}
      />

      {/* 학습자 가입 스택 */}
      <Stack.Screen
        name="LearnerSignupStack"
        component={LearnerSignupStack}
        options={{ headerShown: false }}
      />

      {/* 고수 가입 스택 */}
      <Stack.Screen
        name="TeacherSignupStack"
        component={TeacherSignupStack}
        options={{ headerShown: false }}
      />

      {/* 대시보드, 로그인 등 기존 화면 */}
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
