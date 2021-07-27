import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FileSelectWeb(props) {
  const styles = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  return (
    <View style={styles.container}>
      <Text>File Select Web</Text>
    </View>
  )
}
