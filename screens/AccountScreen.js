import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import firebase from '../firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { myDarkTheme, myLightTheme } from './../styles/Theme';

export default function HomeScreen({ navigation: { navigate } }) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? myDarkTheme : myLightTheme;

  const signOut = async () => {
    console.log('signout clicked')
    try {
      await firebase.auth().signOut()
    } catch(err) {
      console.log('ERROR SIGNING OUT', err)
    }
    navigate('Home')
  }

  return (
    <View style={theme}>
      <KeyboardAwareScrollView>
        <TouchableOpacity
          style={theme.button}
          onPress={signOut}>
          <Text style={theme.button}>Sign out</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  )
}
