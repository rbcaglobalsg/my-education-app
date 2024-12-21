// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import PushNotification from 'react-native-push-notification';
import { StripeProvider } from '@stripe/stripe-react-native';

// i18n 초기화
import './src/i18n';
import { useTranslation } from 'react-i18next';

// 기존 Screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import ReservationsScreen from './src/screens/ReservationsScreen';
import TeacherDashboardScreen from './src/screens/TeacherDashboardScreen';
import LearnerDashboardScreen from './src/screens/LearnerDashboardScreen';

// 새로 추가된 가입 흐름 예시 Screens (없다면 import 제외)
import RoleSelectScreen from './src/screens/RoleSelectScreen';
import LearnerSignupStack from './src/screens/learnerSignup/LearnerSignupStack';
import TeacherSignupStack from './src/screens/teacherSignup/TeacherSignupStack';

// Push Notification 설정
PushNotification.configure({
  onRegister: (token) => console.log("TOKEN:", token),
  onNotification: (notification) => {
    console.log("NOTIFICATION:", notification);
    notification.finish(PushNotification.FetchResult.NoData);
  },
  requestPermissions: Platform.OS === 'ios',
});

// 채널 생성
PushNotification.createChannel(
  {
    channelId: "default-channel-id",
    channelName: "Default Channel",
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`createChannel returned '${created}'`)
);

// PaperProvider 테마 설정
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2f80ed',
  },
};

const Stack = createStackNavigator();

const App = () => {
  const { t } = useTranslation(); // 번역 훅 사용

  return (
    <StripeProvider publishableKey="pk_test_51QCCneI2gZFF4ZNkZSkB3QClhh15CYOQ3uGeGDVowYyf9lkwFDcqiwjf4FtZumOMB84hpMDmV6MA3J6Xj70mQJ6f009cw6NpVi">
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: '#2f80ed' },
              headerTintColor: '#fff',
            }}
          >
            {/* 홈 화면 (앱 이름도 t로 다국어 적용 가능) */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: t('appName') }}
            />

            {/* 역할 선택 화면 */}
            <Stack.Screen
              name="RoleSelect"
              component={RoleSelectScreen}
              options={{ title: t('roleSelectTitle') }}
            />

            {/* 학습자 가입 스택 */}
            <Stack.Screen
              name="LearnerSignupStack"
              component={LearnerSignupStack}
              options={{ headerShown: false }}
            />

            {/* 고수(Teacher) 가입 스택 */}
            <Stack.Screen
              name="TeacherSignupStack"
              component={TeacherSignupStack}
              options={{ headerShown: false }}
            />

            {/* 이하 기존 화면들 */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: t('login') }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: t('signUp') }}
            />
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ title: t('dashboard') }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: t('editProfile') }}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{ title: t('search') }}
            />
            <Stack.Screen
              name="Schedule"
              component={ScheduleScreen}
              options={{ title: t('makeReservation') }}
            />
            <Stack.Screen
              name="Reservations"
              component={ReservationsScreen}
              options={{ title: t('myReservations') }}
            />
            <Stack.Screen
              name="TeacherDashboard"
              component={TeacherDashboardScreen}
              options={{ title: t('teacherDashboard') }}
            />
            <Stack.Screen
              name="LearnerDashboard"
              component={LearnerDashboardScreen}
              options={{ title: t('learnerDashboard') }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StripeProvider>
  );
};

export default App;
