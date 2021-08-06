import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { myDarkTheme, myLightTheme } from './../styles/Theme';

import ReaderControls from '../components/ReaderControls';
import FileSelect from '../components/FileSelect';

export default function HomeScreen() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? myDarkTheme : myLightTheme;

  const [inputShowing, showInput] = useState(true);
  const [readerShowing, showReader] = useState(false);
  const [controlsShowing, showControls] = useState(false);
  const [isPlaying, setPlaying] = useState(false);

  const [text, setText] = useState('');
  const [textArray, setTextArray] = useState([]);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [speedSetting, setSpeedSetting] = useState(500); // # of ms each word is displayed
  const intervalRef = useRef(null);
  const indexRef = useRef(null);
  indexRef.current = currentWordIndex;

  // clear the interval when conditionally rendered components change
  useEffect(() => {
    clearInterval(indexRef.current)
  }, [])

  const startSpeedReading = () => {
    console.log('STARTING SPEED READER, pos, speed, indexRef', currentWordIndex, speedSetting, indexRef.current)
    if (!currentWordIndex) setCurrentWordIndex(0);
    // update rendered word after each tick at the set speed
    intervalRef.current = setInterval(tick, speedSetting);
  }

  const tick = () => {
    console.log("TICK, indexRef", indexRef.current)
    if (indexRef.current >= textArray.length - 1) {
      console.log('tick, calling pause');
      pauseSpeedReading();
      // TODO show words read count, update db, etc.
    } else {
      setCurrentWordIndex(currentWordIndex => currentWordIndex + 1);
    }
  }

  const pauseSpeedReading = () => {
    if (!isPlaying) return;
    console.log('PAUSING SPEED READER, pos, speed, ref index', currentWordIndex, speedSetting, indexRef.current);
    setPlaying(false);
    clearInterval(intervalRef.current);
  }

  const enableSpeedReader = () => {
    if (isPlaying) return;
    setPlaying(true);
    showInput(false);
    showControls(true);
    showReader(true);
  }

  const disableSpeedReader = () => {
    // pause in case the user doesn't pause before changing views
    clearInterval(intervalRef.current);
    setPlaying(false);
    showInput(true);
    showControls(false);
    showReader(false);
  }

  const changeText = text => {
    setText(text.trim());
    setCurrentWordIndex(0);
  }

  const speedReadInputText = () => {
    setTextArray(text.trim().replace(/[^\w,.]|\n+/g, ' ').split(" "));
    enableSpeedReader()
  }

  const speedReadTextFromFile = text => {
    changeText(text)
    setTextArray(text.trim().split(/[ ,'--']+/));
    enableSpeedReader()
  }

  const clearText = () => {
    setText('')
    setTextArray([])
  }

  const styles = StyleSheet.create({
    inputContainer: {
      height: '100%',
    },
    textInput: {
      height: '50%',
      overflow: 'scroll',
      backgroundColor: '#ddd',
      padding: 5,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'solid'
    },
    readerContainer: {
      height: '50%',
      backgroundColor: theme.colors.card,
      color: theme.colors.text,
      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'solid'
    },
    readerText: {
      fontSize: 40,
      color: theme.color
    },
    divider: {
      width: '100%',
      textAlign: 'center',
      color: theme.color,
      padding: 4,
    }
  })

  return (
    <View style={theme.container}>
      { inputShowing &&
        <View style={styles.inputContainer}>
          <Text style={theme.heading}>Enter Text</Text>
          <TextInput
            style={styles.textInput}
            placeholder='Welcome to SpdRdr the speed reader app! This app allows you to speed up the rate at which you read text. Paste any text here to speed read it!'
            placeholderTextColor="#777"
            onChangeText={(t) => changeText(t)}
            value={text}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={15}
          />
          { text.length > 1 &&
            <View style={{ marginBottom: 18, }}>
              <TouchableOpacity
                style={theme.button}
                onPress={clearText}>
                <Text style={theme.buttonTitle}>Clear Text</Text>
              </TouchableOpacity>
            </View>
          }
          <TouchableOpacity
            style={theme.button}
            onPress={speedReadInputText}
            disabled={text ? false : true}>
            <Text style={theme.buttonTitle}>Speed Read Input Text</Text>
          </TouchableOpacity>
          <Text style={styles.divider}>or</Text>
          <FileSelect addTextFromFile={speedReadTextFromFile} />
        </View>
      }
      { readerShowing &&
        <View style={styles.readerContainer}>
          <Text
            style={styles.readerText}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.4}
          >{ textArray[currentWordIndex] }</Text>
        </View>
      }
      { controlsShowing &&
        <ReaderControls
        disableSpeedReader={disableSpeedReader}
          startSpeedReading={startSpeedReading}
          pauseSpeedReading={pauseSpeedReading}
          speedSetting={speedSetting}
          setSpeedSetting={setSpeedSetting}
          setCurrentWordIndex={setCurrentWordIndex}
          // chunking? TODO
        />
      }
    </View>
  )
}
