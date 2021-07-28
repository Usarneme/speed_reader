import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { decode, encode } from 'base-64';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { myDarkTheme, myLightTheme } from './styles/Theme';

import AccountScreen from './screens/AccountScreen';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import SpeedReaderScreen from './screens/SpeedReaderScreen';
import Header from './components/Header';

import firebase from './firebase';

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Tab = createBottomTabNavigator();

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? myDarkTheme : myLightTheme

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            console.log("ERROR AUTHENTICATING")
            console.dir(error)
            setLoading(false)
          });
      } else {
        console.log("NO USER FOUND")
        setLoading(false)
      }
    });
  }, []);

  if (loading) {
    return (
      <>Loading...</>
    )
  }

  return (
    <>
      <Header />
      <NavigationContainer theme={theme}>
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: theme.activeTintColor,
            inactiveTintColor: theme.inactiveTintColor,
          }}
        >
          { user ? (
            <>
              <Tab.Screen
                name="Home"
                options={{ tabBarIcon: () => <Ionicons name="home" size={theme.iconSize} color={theme.inactiveTintColor} /> }}
              >
                {props => <SpeedReaderScreen {...props} extraData={user} />}
              </Tab.Screen>
              <Tab.Screen
                name="Account"
                options={{ tabBarIcon: () => <MaterialCommunityIcons name="account" size={theme.iconSize} color={theme.inactiveTintColor} /> }}
              >
                {props => <AccountScreen {...props} extraData={user} />}
              </Tab.Screen>
            </>
          ) : (
            <>
              <Tab.Screen
                name="Home"
                component={SpeedReaderScreen}
                options={{ tabBarIcon: () => <Ionicons name="home" size={theme.iconSize} color={theme.inactiveTintColor} /> }}
              />
              <Tab.Screen
                name="Login"
                component={LoginScreen}
                options={{ tabBarIcon: () => <MaterialCommunityIcons name="login" size={theme.iconSize} color={theme.inactiveTintColor} /> }}
              />
              <Tab.Screen
                name="Registration"
                component={RegistrationScreen}
                options={{ tabBarIcon: () => <MaterialCommunityIcons name="account" size={theme.iconSize} color={theme.inactiveTintColor} /> }}
              />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}