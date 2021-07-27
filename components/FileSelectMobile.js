import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

export default function FileSelectMobile(props) {
  const [file, setFile] = useState('');

  const getLocalFile = async () => {
    console.log('get local file clicked')
    const chosenFile = await DocumentPicker.getDocumentAsync()
    if (!chosenFile || chosenFile.type !== 'success') {
      console.log('no file chosen')
    } else {
      console.log('picked file:', chosenFile)
      console.log(Object.keys(chosenFile))
      setFile(chosenFile.uri)
    }
  }

  const styles = StyleSheet.create({
    container: {
      maxWidth: '100%',
      borderColor: 'red',
      borderStyle: 'solid',
      borderWidth: 2
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold'
    }
  })
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Mobile file selector</Text>
      <TouchableOpacity onPress={getLocalFile} >
        <Text>Click here to select a text file to speed read</Text>
      </TouchableOpacity>
    </View>
  )
}