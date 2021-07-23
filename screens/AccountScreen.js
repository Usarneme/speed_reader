import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './HomeScreenStyles';
import firebase from '../firebase'

export default function HomeScreen(props) {
  const userID = props.extraData.id

  return (
    <View style={styles.container}>
      account page for { userID }
    </View>
  )
}
