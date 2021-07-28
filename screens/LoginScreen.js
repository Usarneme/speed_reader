import React, { useState } from 'react'
import { useColorScheme, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { myDarkTheme, myLightTheme } from './../styles/Theme';
import firebase from '../firebase'

export default function LoginScreen({navigation}) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? myDarkTheme : myLightTheme;

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onFooterLinkPress = () => {
    navigation.navigate('Registration')
  }

  const onLoginPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log('signed in w uid + pw', response)
        const uid = response.user.uid
        const usersRef = firebase.firestore().collection('users')
        usersRef
          .doc(uid)
          .get()
          .then(firestoreDocument => {
            if (!firestoreDocument.exists) {
              alert("User does not exist anymore.")
              return;
            }
            const user = firestoreDocument.data()
            navigation.navigate('Home', {user: user})
          })
          .catch(error => {
            alert(error)
          });
      })
      .catch(error => {
        alert(error)
      })
  }

  const styles = StyleSheet.create({
    footerView: {
      flex: 1,
      alignItems: "center",
      marginTop: 20
    },
    footerText: {
      fontSize: 16,
      color: theme.color,
    },
    footerLink: {
      color: theme.button.backgroundColor,
      fontWeight: "bold",
      fontSize: 16
    }
  })

  console.log(theme)
  return (
    <View style={theme}>
      <Text style={theme.heading}>Log In</Text>
      <TextInput
        style={theme.input}
        placeholder='E-mail'
        placeholderTextColor="#aaaaaa"
        onChangeText={t => setEmail(t)}
        value={email}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <TextInput
        style={theme.input}
        placeholderTextColor="#aaaaaa"
        secureTextEntry
        placeholder='Password'
        onChangeText={t => setPassword(t)}
        value={password}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={theme.button}
        onPress={() => onLoginPress()}>
        <Text style={theme.buttonTitle}>Log in</Text>
      </TouchableOpacity>
      <View style={styles.footerView}>
        <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
      </View>
    </View>
  )
}

