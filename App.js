import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {decode, encode} from 'base-64';

import AccountScreen from './screens/AccountScreen';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import SpeedReaderScreen from './screens/SpeedReaderScreen';

import Header from './components/Header';

import firebase from './firebase';

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Tab = createBottomTabNavigator();
const myLightTheme = {
  ...DefaultTheme,
  backgroundColor: 'rgb(12,12,12)',
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(100,100,100)',
    primary: 'rgb(240,120,120)',
    text: 'rgb(150,200,255)',
    card: 'rgb(50,50,50)',
    border: 'rgb(240,120,120)'
  }
}

const myDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'rgb(90,90,90)',
    border: 'rgb(39, 39, 41)',
    card: 'rgb(18, 18, 18)',
    notification: 'rgb(255, 69, 58)',
    primary: 'rgb(10, 132, 255)',
    text: 'rgb(229, 229, 231)',
  }
}

export default function App() {
  console.dir(DarkTheme)
  // { dark: false; colors: [
  //   background: "rgb(242, 242, 242)"
  //   border: "rgb(216, 216, 216)"
  //   card: "rgb(255, 255, 255)" => bottom navigation background color
  //   notification: "rgb(255, 59, 48)"
  //   primary: "rgb(0, 122, 255)"​ => primary text color
  //   text: "rgb(28, 28, 30)" => bottom navigation text color (non-highlighted route)
  // ]}
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
      <NavigationContainer theme={scheme === 'dark' ? myDarkTheme : myLightTheme}>
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