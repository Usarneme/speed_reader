import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import SpeedReaderScreen from './screens/SpeedReaderScreen';
import SettingsScreen from './screens/SettingsScreen';
import Header from './components/Header';
import { ThemeProvider, useAppTheme } from './context/ThemeContext';

const Tab = createBottomTabNavigator();

function MainAppContent() {
  const { theme, isDark } = useAppTheme();

  return (
    <View style={[styles.fullFlex, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.responsiveOuter}>
        <View style={styles.responsiveInner}>
          <NavigationContainer theme={theme}>
            <Header />
            <Tab.Navigator
              screenOptions={{
                tabBarActiveTintColor: theme.activeTintColor,
                tabBarInactiveTintColor: theme.inactiveTintColor,
                headerStatusBarHeight: 0,
                headerTitleAlign: 'left',
                headerStyle: {
                  height: 36,
                  backgroundColor: theme.colors.card,
                  elevation: 0,
                  shadowOpacity: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border || 'rgba(255,255,255,0.1)',
                },
                headerTitleStyle: {
                  fontSize: 14,
                  fontWeight: '700',
                  color: theme.colors.text || '#FFFFFF',
                },
                headerTitleContainerStyle: {
                  paddingLeft: 16,
                },
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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullFlex: {
    flex: 1,
  },
  responsiveOuter: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  responsiveInner: {
    flex: 1,
    width: '100%',
    maxWidth: 900,
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainAppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}