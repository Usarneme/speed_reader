import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text>SpdRdr</Text>
      </View>
      <View style={styles.inner}>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={require('./../assets/images/spdrdr.svg')} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    display: 'flex',
    flexDirection: 'row',
    height: '92px',
    alignItems: 'stretch'
  },
  inner: {
    flex: 1,
    borderWidth: '2px',
    borderColor: 'red',
    borderStyle: 'solid',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center'
  },
  imgContainer: {
    flex: 1,
    display: 'flex',
    // alignItems: 'center'
  },
  img: {
    flex: 1,
    minHeight: '120px',
    transform: 'scale(0.75)',
  }
})