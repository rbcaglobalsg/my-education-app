// C:\Users\marcu\education_app\EducationApp\src\screens\teacherSignup\TeacherSignupStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TeacherStep1 from './TeacherStep1';
import TeacherStep2 from './TeacherStep2';
import TeacherStep3 from './TeacherStep3';
import TeacherDone from './TeacherDone';

const Stack = createStackNavigator();

const TeacherSignupStack = () => {
  return (
    <Stack.Navigator initialRouteName="TeacherStep1">
      <Stack.Screen 
        name="TeacherStep1" 
        component={TeacherStep1} 
        options={{ title: '고수 가입' }} 
      />
      <Stack.Screen 
        name="TeacherStep2" 
        component={TeacherStep2} 
        options={{ title: '고수 가입' }} 
      />
      <Stack.Screen 
        name="TeacherStep3" 
        component={TeacherStep3} 
        options={{ title: '고수 가입' }} 
      />
      <Stack.Screen 
        name="TeacherDone" 
        component={TeacherDone} 
        options={{ title: '가입 완료' }} 
      />
    </Stack.Navigator>
  );
};

export default TeacherSignupStack;
