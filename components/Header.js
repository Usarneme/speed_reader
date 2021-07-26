import React from 'react';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

import Logo from './Logo'

export default function Header() {
  const { colors } = useTheme(); // primary, background, border, card, notification, primary, text
  const styles = StyleSheet.create({
    outer: {
      display: 'flex',
      flexDirection: 'row',
      height: 59,
      alignItems: 'stretch',
      backgroundColor: colors.background,
      color: colors.primary,
    },
    inner: {
      backgroundColor: colors.card,
      flex: 1,
      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontSize: 35,
      fontWeight: 'bold'
    }
  })

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
