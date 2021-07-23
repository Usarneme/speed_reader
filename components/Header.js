import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Logo from './Logo'

export default function Header() {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.text}>SpdRdr</Text>
      </View>
      <View style={styles.inner}>
        <Logo />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    display: 'flex',
    flexDirection: 'row',
    height: '59px',
    alignItems: 'stretch',
    background: 'rgba(255,255,255,0.15)'
  },
  inner: {
    background: 'rgba(255,255,255,0.15)',
    flex: 1,
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: '2rem',
    fontWeight: 'bold'
  }
})