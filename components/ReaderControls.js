import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';

export default function ReaderControls(props) {

  return (
    <View style={styles.container}>
      <Text style={styles.controlsHeading}>Controls</Text>
      <TouchableOpacity style={styles.button} onPress={props.startSpeedReading} >
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={props.pauseSpeedReading} >
        <Text style={styles.buttonText}>Pause</Text>
      </TouchableOpacity>
      <View >
        <Slider
          value={props.speedSetting}
          minimumValue={10}
          maximumValue={2000}
          step={10}
          onValueChange={v => props.setSpeedSetting(v)}
        />
        <Text>Value: {props.speedSetting}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
    },
    controlsHeading: {
      textAlign: 'center',
      borderColor: 'gray',
      borderBottomWidth: 2,
      borderStyle: 'dashed',
      color: '#eee',
      fontSize: 22
    },
    button: {
      height: 47,
      borderRadius: 5,
      backgroundColor: '#788eec',
      width: '100%',
      alignItems: "center",
      justifyContent: 'center',
      marginBottom: 2
    },
    buttonText: {
      color: 'white',
      fontSize: 16
    }
  })