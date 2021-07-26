import React, { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from './../firebase'

import Logo from './../components/Logo'

export default function RegistrationScreen({navigation}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const onFooterLinkPress = () => {
    navigation.navigate('Login')
  }

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.")
      return
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid
        const data = {
          id: uid,
          email,
          fullName,
        };
        const usersRef = firebase.firestore().collection('users')
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            navigation.navigate('Home', {user: data})
          })
          .catch((error) => {
            alert(error)
          });
      })
      .catch((error) => {
        alert(error)
    });
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <View style={styles.logoContainer}>
          <Logo style={{ borderWidth: 2, borderColor: 'red', borderStyle: 'solid', height: 90, width: '100%' }}/>
        </View>
        <TextInput
          style={styles.input}
          placeholder='Full Name'
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder='E-mail'
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder='Password'
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder='Confirm Password'
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}>
          <Text style={styles.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {

    },
    logoContainer: {
      backgroundColor: 'rgba(255,255,255,0.75)',
      flex: 1,
      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 40,
      marginBottom: 15,
      borderWidth: 2, borderColor: 'red', borderStyle: 'solid', height: 90, width: '100%'
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    }
})