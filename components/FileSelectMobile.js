import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as FileSystem from 'expo-file-system'

export default function FileSelectMobile(props) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      maxWidth: '100%'
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold'
    }
  })
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mobile file selector</Text>
    </View>
  )
}