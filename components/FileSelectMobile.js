import React, { useState } from 'react';
import { Text, TouchableOpacity, useColorScheme } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

import { myDarkTheme, myLightTheme } from './../styles/Theme';

export default function FileSelectMobile(props) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? myDarkTheme : myLightTheme;

  const getLocalFile = async () => {
    console.log('get local file clicked')
    try {
      const chosenFile = await DocumentPicker.getDocumentAsync()
      if (!chosenFile || chosenFile.type !== 'success') {
        console.log('no file chosen')
      } else {
        console.log('picked file:', chosenFile)
        console.log('file uri starts with file/ ?', chosenFile.uri.substring(0,5))
        if (chosenFile.uri.substring(0,4) !== 'file') {
          await readFileContent('file:' + chosenFile.uri)
        } else {
          await readFileContent(chosenFile.uri)
        }
      }
    } catch (err) {
      console.log("ERROR GETTING FILE", err)
    }
  }

  const readFileContent = async (file) => {
    console.log('reading file from ',file)
    if (!file) return
    try {
      const res = await FileSystem.readAsStringAsync(file)
      console.log(`finished reading file\n\n CONTENT: ${res}\n\n`)
      props.addTextFromFile(res)
    } catch (err) {
      console.log("ERROR reading file", err)
    }
  }

  return (
    <TouchableOpacity onPress={getLocalFile} style={theme.button} >
      <Text style={theme.buttonTitle}>Select a text file to speed read</Text>
    </TouchableOpacity>
  )
}
