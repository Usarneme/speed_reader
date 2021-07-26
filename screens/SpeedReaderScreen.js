import React, { useRef, useState } from 'react';
import { FlatList, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

import ReaderControls from '../components/ReaderControls';

export default function HomeScreen() {
  const [text, setText] = useState('')
  const [inputShowing, showInput] = useState(true)
  const [readerShowing, showReader] = useState(false)
  const [textArray, setTextArray] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [speedSetting, setSpeedSetting] = useState(500) // # of ms each word is displayed
  const intervalRef = useRef(null)
  const indexRef = useRef(null)
  indexRef.current = currentWordIndex

  const startSpeedReading = () => {
    console.log('STARTING SPEED READER, pos, speed, indexRef', currentWordIndex, speedSetting, indexRef.current)
    if (!currentWordIndex) setCurrentWordIndex(0)
    // update rendered word after each tick at the set speed
    intervalRef.current = setInterval(tick, speedSetting)
  }

  const tick = () => {
    console.log("TICK, indexRef", indexRef.current)
    if (indexRef.current >= textArray.length - 1) {
      console.log('tick, calling pause')
      pauseSpeedReading()
      // TODO show words read count, update db, etc.
    } else {
      setCurrentWordIndex(currentWordIndex => currentWordIndex + 1)
      console.log('tick after updating, index', indexRef.current)
    }
  }

  const pauseSpeedReading = () => {
    console.log('PAUSING SPEED READER, pos, speed, ref index', currentWordIndex, speedSetting, indexRef.current)
    // pause timeout
    clearInterval(intervalRef.current)
  }

  const enableSpeedReader = () => {
    setTextArray(text.split(' '))
    showInput(false)
    showReader(true)
  }

  const disableSpeedReader = () => {
    // pause in case the user doesn't pause before changing views
    clearInterval(intervalRef.current)
    showInput(true)
    showReader(false)
  }

  const changeText = text => {
    setText(text)
    setCurrentWordIndex(0)
  }

  const { colors } = useTheme(); // primary, background, border, card, notification, primary, text
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      minHeight: '100%',
      backgroundColor: colors.background,
    },
    heading: {
      marginTop: 9,
      marginBottom: 9,
      fontSize: 44,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.primary
    },
    readerContainer: {
      marginTop: 10,
      // backgroundColor: colors.card,
      color: colors.text,
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
      height: '50%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    textInput: {
      height: '50%',
      width: '100%',
      overflow: 'scroll',
      backgroundColor: 'white',
      margin: 5,
      padding: 5,
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
      fontSize: 27,
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.85)',
      color: '#111'
    },
    button: {
      height: 47,
      borderRadius: 5,
      backgroundColor: '#788eec',
      alignItems: "center",
      justifyContent: 'center'
    },
    buttonText: {
      color: 'white',
      fontSize: 16
    }
  })

  return (
    <View style={styles.container}>
      { inputShowing &&
        <View style={styles.readerContainer}>
          <Text style={styles.heading}>Enter Text To Speed Read</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Welcome to SpdRdr the speed reader app! This app allows you to speed up the rate at which you read text. Paste any text here to speed read it!'
            placeholderTextColor="#aaaaaa"
            onChangeText={(t) => changeText(t)}
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
