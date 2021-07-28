import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import FileSelectMobile from './FileSelectMobile';
import FileSelectWeb from './FileSelectWeb';

export default function FileUploads(props) {
  const styles = StyleSheet.create({
    container: {
      // display: 'flex',
      // flex: 1,
      // minHeight: '100%',
      // backgroundColor: colors.background,
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
      { Platform.OS === 'ios' || Platform.OS === 'android' ?
        <FileSelectMobile style={styles.children} addTextFromFile={props.changeText} />
        :
        <FileSelectWeb style={styles.children} addTextFromFile={props.changeText} />
      }
    </View>
  )
}
