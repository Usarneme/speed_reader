import React, { useState } from 'react';
import { useColorScheme, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { myDarkTheme, myLightTheme } from './../styles/Theme';
import firebase from '../firebase';

export default function RegistrationScreen({navigation}) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? myDarkTheme : myLightTheme;

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
    <View style={theme}>
      <KeyboardAwareScrollView
        style={theme.container}
        keyboardShouldPersistTaps="always">
        <Text style={theme.heading}>Account Setup</Text>
        <TextInput
          style={theme.input}
          placeholder='Full Name'
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={theme.input}
          placeholder='E-mail'
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={theme.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder='Password'
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={theme.input}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder='Confirm Password'
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={theme.button}
          onPress={() => onRegisterPress()}>
          <Text style={theme.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View style={theme.footerView}>
          <Text style={theme.footerText}>Already have an account? <Text onPress={onFooterLinkPress} style={theme.footerLink}>Log in</Text></Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}
