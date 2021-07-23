import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function Logo() {
  return (
    <View style={styles.img} alt="Spud Rudder the speed reader mascot/logo" />
  )
}

const styles = StyleSheet.create({
    img: {
    width: '45%',
    backgroundImage: 'url(https://raw.githubusercontent.com/Usarneme/speed_reader/main/assets/images/spdrdr.svg)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    height: 0,
    padding: 0,
    paddingBottom: '30%',
  },
})