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
      display: 'flex'
    },
    heading: {
      color: '#cdc',
      fontSize: 23,
      fontWeight: 'bold'
    },
    children: {
      // display: 'flex',
      // flex: 1,
      backgroundColor: 'rgb(255,255,255)',
      color: 'rgb(20,20,20)',
      width: '100%',
      height: '100%'
    }
  })
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload File To Parse Into Speed Reader</Text>
      { window && window.FileReader ?
        <View>
          <Text>WEB</Text>
          <FileSelectWeb style={styles.children} />
        </View>
        :
        <View>
          <Text>MOBILE</Text>
          <FileSelectMobile style={styles.children} />
        </View>
      }
    </View>
  )
}
