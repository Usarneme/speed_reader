import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
    <View style={[styles.fullFlex, { backgroundColor: theme.colors.background }]}>
      <View style={styles.responsiveOuter}>
        <View style={styles.responsiveInner}>
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