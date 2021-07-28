import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { myDarkTheme, myLightTheme } from './../styles/Theme';

export default function ReaderControls(props) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? myDarkTheme : myLightTheme;

  const styles = StyleSheet.create({
    controlsHeading: {
      textAlign: 'center',
      color: theme.heading.color,
      fontSize: 22
    },
    splitView: {
      display: 'flex',
      flexDirection: 'row',
    },
    splitButton: {
      ...theme.button,
      flex: 1,
    },
    sliderContainer: {
      margin: 23,
      // backgroundColor: theme.backgroundColor,
    }
  })

  return (
    <View style={theme.container}>
      <Text style={styles.controlsHeading}>Controls</Text>
      <View style={styles.splitView}>
        <TouchableOpacity style={styles.splitButton} onPress={props.startSpeedReading} >
          <Ionicons name="play-outline" size={theme.iconSize} color={theme.buttonTitle.color} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.splitButton} onPress={props.pauseSpeedReading} >
          <Ionicons name="pause-outline" size={theme.iconSize} color={theme.buttonTitle.color} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={theme.button} onPress={() => props.setCurrentWordIndex(0)} >
        <Text style={theme.buttonTitle}>Restart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={theme.button} onPress={props.disableSpeedReader}>
        <Text style={theme.buttonTitle}>Change Text</Text>
      </TouchableOpacity>
      <View style={styles.sliderContainer}>
        <Slider
          value={props.speedSetting}
          minimumValue={20}
          maximumValue={600}
          step={4}
          onValueChange={v => props.setSpeedSetting(v)}
        />
        <Text style={styles.controlsHeading}>{ ((1000 / props.speedSetting) * 60).toFixed(0) } Words Per Minute</Text>
      </View>
    </View>
  )
}
