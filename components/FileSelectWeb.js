import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function FileSelectWeb(props) {
  const handleFile = event => {
    const file = event.target.files[0]
    console.log(file)
    const isPdf = file.type === 'application/pdf'
    const reader = new FileReader()
    reader.onload = () => {
      const fileData = reader.result
      if (isPdf) {
        console.log('PARSED PDF FILE')
        // const dataArr = new Uint16Array(fileData)
        // console.log('got data array', dataArr)
        // const parsedJson = JSON.stringify(dataArr, null, ' ')
        // console.log('got parsed json', parsedJson)
        // const texted = String.fromCharCode.apply(null, new Uint16Array(fileData))
        // console.log('got text', texted)
      } else {
        console.log("PARSED TEXT FILE")
        props.addTextFromFile(fileData)
        console.log(fileData)
      }
      console.log("END OF FILE")
    }
    if (isPdf) {
      reader.readAsArrayBuffer(file)
    } else {
      reader.readAsText(file)
    }
  }

  const styles = StyleSheet.create({
    container: {
      maxWidth: '100%',
      borderColor: 'red',
      borderStyle: 'solid',
      borderWidth: 2
    }
  })

  return (
    <View style={styles.container}>
      <Text>File Select Web</Text>
      <input type='file' onChange={e => handleFile(e)} />
    </View>
  )
}
