import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// import Slider from 'rn-range-slider';
import Thumb from './SliderComponents/Thumb';
import Rail from './SliderComponents/Rail';
import RailSelected from './SliderComponents/RailSelected';
import Notch from './SliderComponents/Notch';
import Label from './SliderComponents/Label';

export default function ReaderControls(props) {
  const [sliderValue, setSliderValue] = useState(400)

  // const renderThumb = useCallback(() => <Thumb />, []);
  // const renderRail = useCallback(() => <Rail />, []);
  // const renderRailSelected = useCallback(() => <RailSelected />, []);
  // const renderNotch = useCallback(() => <Notch />, []);
  // const renderLabel = useCallback(() => <Label />, []);

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
        {/* <Slider
          value={sliderValue}
          min={10}
          max={4000}
          step={10}
          disableRange={true}
          onValueChange={value => setSliderValue({ value })}
          // renderThumb={renderThumb}
          // renderRail={renderRail}
          // renderRailSelected={renderRailSelected}
          // renderLabel={renderLabel}
          // renderNotch={renderNotch}
        /> */}
        <Text>Value: {sliderValue}</Text>
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