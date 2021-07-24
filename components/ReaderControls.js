import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

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
      <TouchableOpacity style={styles.button} onPress={props.setSpeedSetting} >
        <Text style={styles.buttonText}>Change Speed TODO</Text>
      </TouchableOpacity>
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