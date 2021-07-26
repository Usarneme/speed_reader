import * as React from 'react';
import { Image, View } from 'react-native';

function Logo() {
  const styles = {
    imgContainer: {
      flex: 1,
      maxWidth: '100%',
      maxHeight: '100%',
    },
    img: {
      flex: 1,
      maxWidth: '100%',
      maxHeight: '100%',
      resizeMode: 'contain'
    }
  }
  return (
    <View style={styles.imgContainer}>
      <Image
        source={require('./../assets/images/Miami_potato_square.png')}
        style={styles.img}
      />
    </View>
  )
}

export default Logo
