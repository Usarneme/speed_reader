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
    setTextArray(text.trim().split(/[ ,'--']+/));
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
    setText(text);
    setCurrentWordIndex(0);
  }

  const styles = StyleSheet.create({
    readerContainer: {
      // marginTop: 10,
      // backgroundColor: theme.colors.card,
      color: theme.colors.text,
      // display: 'flex',
      // alignItems: 'center',
      // flexDirection: 'column',
      // width: '100%',
      // height: '60%',
      // justifyContent: 'center',
      // alignItems: 'center'
    },
    // textInput: {
    //   height: '60%',
    //   width: '100%',
    //   overflow: 'scroll',
    //   backgroundColor: 'white',
    //   margin: 5,
    //   padding: 5,
    //   borderWidth: 1,
    //   borderColor: '#111',
    //   borderStyle: 'solid'
    // },
    readerView: {
      // width: '100%',
      // alignItems: 'center',
      // alignContent: 'center',
      // alignSelf: 'center',
      // justifyContent: 'center',
      // fontSize: 27,
      // flex: 1,
      // margin: 2,
      // backgroundColor: 'rgba(255,255,255,0.85)',
      // color: theme.colors.text,
    },
    readerText: {
      fontSize: 40
    },
  })

  return (
    <View style={theme.container}>
      { inputShowing &&
        <View style={styles.readerContainer}>
          <Text style={theme.heading}>Enter Text</Text>
          <TextInput
            style={theme.input}
            placeholder='Welcome to SpdRdr the speed reader app! This app allows you to speed up the rate at which you read text. Paste any text here to speed read it!'
            placeholderTextColor="#aaaaaa"
            onChangeText={(t) => changeText(t)}
            value={text}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={15}
          />
          <TouchableOpacity style={theme.button} onPress={enableSpeedReader} disabled={text ? false : true}>
            <Text style={theme.buttonText}>Speed Read Text</Text>
          </TouchableOpacity>
          <FileSelect changeText={changeText} />
        </View>
      }
      { readerShowing &&
        <View style={styles.readerContainer}>
          <View
            style={styles.readerView}
            onLayout={(e => {
              const { width } = e.nativeEvent.layout
              console.log('on layout, found width', width)
            })}
            >
            <Text
              style={styles.readerText}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.4}
            >{ textArray[currentWordIndex] }</Text>
          </View>
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
