// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import PushNotification from 'react-native-push-notification';
import { StripeProvider } from '@stripe/stripe-react-native'; // StripeProvider 추가

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import ReservationsScreen from './src/screens/ReservationsScreen';
import TeacherDashboardScreen from './src/screens/TeacherDashboardScreen';
import LearnerDashboardScreen from './src/screens/LearnerDashboardScreen';

PushNotification.configure({
    onRegister: (token) => console.log("TOKEN:", token),
    onNotification: (notification) => {
        console.log("NOTIFICATION:", notification);
        notification.finish(PushNotification.FetchResult.NoData);
    },
    requestPermissions: Platform.OS === 'ios'
});

PushNotification.createChannel(
    {
        channelId: "default-channel-id",
        channelName: "Default Channel",
        importance: 4,
        vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`)
);

const Stack = createStackNavigator();

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#2f80ed',
    },
};

const App = () => {
    return (
        <StripeProvider publishableKey="pk_test_51QCCneI2gZFF4ZNkZSkB3QClhh15CYOQ3uGeGDVowYyf9lkwFDcqiwjf4FtZumOMB84hpMDmV6MA3J6Xj70mQJ6f009cw6NpVi"> 
            <PaperProvider theme={theme}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Login" screenOptions={{
                        headerStyle: { backgroundColor: '#2f80ed' },
                        headerTintColor: '#fff'
                    }}>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
                        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
                        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
                        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Edit Profile' }} />
                        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
                        <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Make a Reservation' }} />
                        <Stack.Screen name="Reservations" component={ReservationsScreen} options={{ title: 'My Reservations' }} />
                        <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} options={{ title: 'Teacher Dashboard' }} />
                        <Stack.Screen name="LearnerDashboard" component={LearnerDashboardScreen} options={{ title: 'Learner Dashboard' }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </StripeProvider>
    );
};

export default App;
