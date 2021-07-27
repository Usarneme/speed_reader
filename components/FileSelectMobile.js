import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as FileSystem from 'expo-file-system'

export default function FileSelectMobile(props) {
  const styles = StyleSheet.create({
    container: {
      flex: 1
    }

  })
  return (
    <View style={styles.container}>
      <Text>Mobile file selector</Text>
    </View>
  )
}