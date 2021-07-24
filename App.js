import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {decode, encode} from 'base-64'

import AccountScreen from './screens/AccountScreen'
import LoginScreen from './screens/LoginScreen'
import RegistrationScreen from './screens/RegistrationScreen'
import SpeedReaderScreen from './screens/SpeedReaderScreen'

import Header from './components/Header'

import firebase from './firebase'

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Tab = createBottomTabNavigator();
const myTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'rgba(0,0,0,0.45)',
    primary: 'rgb(255,135,85)'
  }
}

export default function App() {
  const scheme = useColorScheme();

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
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : myTheme}>
        <Tab.Navigator>
          { user ? (
            <>
              <Tab.Screen name="Home">
                {props => <SpeedReaderScreen {...props} extraData={user} />}
              </Tab.Screen>
              <Tab.Screen name="Account">
                {props => <AccountScreen {...props} extraData={user} />}
              </Tab.Screen>
            </>
          ) : (
            <>
              <Tab.Screen name="Home" component={SpeedReaderScreen} />
              <Tab.Screen name="Login" component={LoginScreen} />
              <Tab.Screen name="Registration" component={RegistrationScreen} />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}