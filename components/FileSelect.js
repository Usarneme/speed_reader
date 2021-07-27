import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';

import FileSelectMobile from './FileSelectMobile';
import FileSelectWeb from './FileSelectWeb';

export default function FileUploads(props) {
  const ensureDirExists = async dir => {
    return await FileSystem.getInfoAsync(dir).exists
  }

  const getFile = async () => {
    try {
      const dirExists = await ensureDirExists()
      if (!dirExists) throw new Error("No directory of that name found")
    } catch (err) {
      console.log('ERROR', err)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    heading: {
      color: '#cdc',
      fontSize: 33,
      fontWeight: 'bold'
    }
  })
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload File To Parse Into Speed Reader</Text>
      { !window || !window.FileReader ?
      <FileSelectMobile /> :
      <FileSelectWeb />
      }
    </View>
  )
}
