import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

const styles = StyleSheet.create({
  imgContainer: {
    flex: 1,
    maxWidth: '100%',
    maxHeight: '100%',
    minHeight: 50,
    minWidth: 50,
  },
  img: {
    flex: 1,
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

function Logo() {
  return (
    <View style={styles.imgContainer}>
      <Image
        source={require('./../assets/images/Miami_potato_square.png')}
        style={styles.img}
        contentFit="contain"
        transition={200}
      />
    </View>
  );
}

export default Logo;
