import React, { useEffect, useState } from 'react';
import { FlatList, Image, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native';

import ReaderControls from '../components/ReaderControls';

export default function HomeScreen() {
  const [text, setText] = useState('')
  const [inputShowing, showInput] = useState(true)
  const [readerShowing, showReader] = useState(false)
  const [textArray, setTextArray] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [speedSetting, setSpeedSetting] = useState(1000) // # of ms each word is displayed
  let timer = null;

  const enableSpeedReader = () => {
    setTextArray(text.split(' '))
    showInput(false)
    showReader(true)
  }

  const disableSpeedReader = () => {
    // pause in case the user doesn't pause before changing views
    clearTimeout(timer)
    showInput(true)
    showReader(false)
  }

  const startSpeedReading = () => {
    console.log('STARTING SPEED READER, pos, speed', currentWordIndex, speedSetting)
    if (!currentWordIndex) setCurrentWordIndex(0)
    // look at speed
    // start timeout
    // update rendered word after each tick
    timer = setTimeout(() => {
      if (currentWordIndex >= textArray.length) {
        pauseSpeedReading()
        // TODO show words read count, update db, etc.
      } else {
        setCurrentWordIndex(currentWordIndex + 1)
      }
    }, speedSetting)
  }

  const pauseSpeedReading = () => {
    console.log('STOPPING SPEED READER, pos, speed', currentWordIndex, speedSetting)
    // pause timeout
    clearTimeout(timer)
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
            onPress={enableSpeedReader}
          >
            <Text style={styles.buttonText}>Speed Read Text</Text>
          </TouchableOpacity>
        </View>
      }
      { readerShowing &&
        <View style={styles.readerContainer}>
          <Text style={styles.reader}>
            { textArray[currentWordIndex] }
          </Text>
          <TouchableOpacity style={styles.button} onPress={disableSpeedReader}>
            <Text style={styles.buttonText}>Input Text</Text>
          </TouchableOpacity>
        </View>
      }
      <ReaderControls
        startSpeedReading={startSpeedReading}
        pauseSpeedReading={pauseSpeedReading}
        setSpeedSetting={setSpeedSetting}
        // chunking? TODO
      />
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
      height: '60vh',
      width: '100%',
      overflow: 'scroll',
      backgroundColor: 'white',
      flex: 1,
      margin: 2,
      borderWidth: 1,
      borderColor: '#111',
      borderStyle: 'solid'
    },
    reader: {
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      justifyItems: 'center',
      justifySelf: 'center',
      fontSize: '1.8rem',
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.85)',
      color: '#111'
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