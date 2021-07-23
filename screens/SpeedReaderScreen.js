import React, { useEffect, useState } from 'react'
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from './HomeScreenStyles';

export default function HomeScreen() {
  const [text, setText] = useState('')
  const [inputShowing, showInput] = useState(true)
  const [readerShowing, showReader] = useState(false)

  const onAddButtonPress = () => {
    console.log('button pressed')
    showInput(false)
    showReader(true)
  }

  return (
    <View style={styles.container}>
      { inputShowing &&
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder='Place text to speed read here...'
            placeholderTextColor="#aaaaaa"
            onChangeText={(t) => setText(t)}
            value={text}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={15}
          />
          <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
            <Text style={styles.buttonText}>Add Text To Speed Reader</Text>
          </TouchableOpacity>
        </View>
      }
      { readerShowing &&
        <View style={styles.readerContainer}>
          <Text>
            { text }
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => showReader(false)}>
            <Text style={styles.buttonText}>Hide Speed Reader</Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  )
}