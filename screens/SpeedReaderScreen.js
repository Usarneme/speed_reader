import React, { useEffect, useState } from 'react'
import { FlatList, Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [text, setText] = useState('')
  const [inputShowing, showInput] = useState(true)
  const [readerShowing, showReader] = useState(false)

  const onAddButtonPress = () => {
    console.log('button pressed')
    showInput(false)
    showReader(true)
  }

  return (
    <View style={styles.container}>
      { inputShowing &&
        <View style={styles.readerContainer}>
          <TextInput
            style={styles.textInput}
            placeholder='Welcome to SpdRdr the speed reader app! This app allows you to speed up the rate at which you read text. Paste any text here to speed read it!'
            placeholderTextColor="#aaaaaa"
            onChangeText={(t) => setText(t)}
            value={text}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={15}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={onAddButtonPress}
            disabled={text.length > 0 ? 'false' : 'disabled'}
          >
            <Text style={styles.buttonText}>Add Text To Speed Reader</Text>
          </TouchableOpacity>
        </View>
      }
      { readerShowing &&
        <View style={styles.readerContainer}>
          <Text>
            { text }
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => showReader(false)}>
            <Text style={styles.buttonText}>Hide Speed Reader</Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1
    },
    readerContainer: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      marginTop: 20,
      marginBottom: 20,
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textInput: {
      height: '70vh',
      width: '100%',
      overflow: 'scroll',
      backgroundColor: 'white',
      flex: 1,
      margin: 2,
      borderWidth: 1,
      borderColor: '#111',
      borderStyle: 'solid'
    },
    button: {
      height: 47,
      borderRadius: 5,
      backgroundColor: '#788eec',
      width: '100%',
      alignItems: "center",
      justifyContent: 'center'
    },
    buttonText: {
      color: 'white',
      fontSize: 16
    }
})