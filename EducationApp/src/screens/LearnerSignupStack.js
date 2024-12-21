// C:\Users\marcu\education_app\EducationApp\src\screens\learnerSignup\LearnerSignupStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LearnerStep1 from './LearnerStep1';
import LearnerStep2 from './LearnerStep2';
import LearnerDone from './LearnerDone';

const Stack = createStackNavigator();

const LearnerSignupStack = () => {
  return (
    <Stack.Navigator initialRouteName="LearnerStep1">
      <Stack.Screen 
        name="LearnerStep1" 
        component={LearnerStep1} 
        options={{ title: '학습자 가입' }} 
      />
      <Stack.Screen 
        name="LearnerStep2" 
        component={LearnerStep2} 
        options={{ title: '학습자 가입' }} 
      />
      <Stack.Screen 
        name="LearnerDone" 
        component={LearnerDone} 
        options={{ title: '가입 완료' }} 
      />
    </Stack.Navigator>
  );
};

export default LearnerSignupStack;
