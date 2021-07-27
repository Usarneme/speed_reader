import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import FileSelectMobile from './FileSelectMobile';
import FileSelectWeb from './FileSelectWeb';

export default function FileUploads(props) {
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
      { Platform.OS === 'ios' || Platform.OS === 'android' ?
        <View>
          <Text>MOBILE</Text>
          <FileSelectMobile style={styles.children} addTextFromFile={props.changeText} />
        </View>
        :
        <View>
          <Text>WEB</Text>
          <FileSelectWeb style={styles.children} addTextFromFile={props.changeText} />
        </View>
      }
    </View>
  )
}
