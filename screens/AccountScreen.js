import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import firebase from '../firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function HomeScreen({ navigation: { navigate } }) {
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
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={signOut}>
          <Text style={styles.buttonTitle}>Sign out</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  )
}
