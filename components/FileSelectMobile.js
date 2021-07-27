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
      setFile(chosenFile.uri)
      readFileContent(chosenFile.uri)
    }
  }

  const readFileContent = async uri => {
    if (!file) return
    console.log('reading file from ',uri)
    try {
      const res = await FileSystem.readAsStringAsync(uri)
      console.log('finished reading file',res)
      props.addTextFromFile(res)
    } catch (err) {
      console.log("ERROR reading file", err)
    }
  }

  const styles = StyleSheet.create({
    container: {
      // display: 'flex',
      // flex: 1,
      // minHeight: '100%',
      // backgroundColor: colors.background,
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold'
    },
    button: {
      height: 32,
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
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={getLocalFile} style={styles.button} >
        <Text style={styles.buttonText}>Select a text file to speed read</Text>
      </TouchableOpacity>
      <Text>{file}</Text>
    </View>
  )
}
