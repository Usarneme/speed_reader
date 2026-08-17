import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SpeedReaderScreen from './screens/SpeedReaderScreen';
import SettingsScreen from './screens/SettingsScreen';
import Header from './components/Header';
import { ThemeProvider, useAppTheme } from './context/ThemeContext';

const Tab = createBottomTabNavigator();

function MainAppContent() {
  const { theme } = useAppTheme();

  return (
    <NavigationContainer theme={theme}>
      <Header />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.activeTintColor,
          tabBarInactiveTintColor: theme.inactiveTintColor,
        }}
      >
        <Tab.Screen
          name="Home"
          component={SpeedReaderScreen}
          options={{
            tabBarIcon: () => <Ionicons name="home" size={theme.iconSize} color={theme.inactiveTintColor} />
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: () => <Ionicons name="settings-outline" size={theme.iconSize} color={theme.inactiveTintColor} />
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}