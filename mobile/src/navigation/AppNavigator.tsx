import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';
import { HomeScreen } from '../screens/HomeScreen';
import { InsuranceSelectionScreen } from '../screens/InsuranceSelectionScreen';
import { ApplicationFormScreen } from '../screens/ApplicationFormScreen';
import { SuccessScreen } from '../screens/SuccessScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminInsurancesScreen from '../screens/AdminInsurancesScreen';
import AdminInsuranceFormScreen from '../screens/AdminInsuranceFormScreen';
import AdminApplicationsScreen from '../screens/AdminApplicationsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <AdminAuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >

          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="InsuranceSelection" component={InsuranceSelectionScreen} />
          <Stack.Screen name="ApplicationForm" component={ApplicationFormScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />


          <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="AdminInsurances" component={AdminInsurancesScreen} />
          <Stack.Screen name="AdminInsuranceForm" component={AdminInsuranceFormScreen} />
          <Stack.Screen name="AdminApplications" component={AdminApplicationsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AdminAuthProvider>
  );
};