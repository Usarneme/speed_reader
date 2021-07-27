import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function FileSelectWeb(props) {
  const handleFile = event => {
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onload = e => {
      console.log("PARSED FILE")
      console.log(e.target.result)
      console.log("END OF FILE")
    }
    reader.readAsText(file)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1
    }
  })
  return (
    <View style={styles.container}>
      <Text>File Select Web</Text>
      <input type='file' onChange={e => handleFile(e)} />
    </View>
  )
}
