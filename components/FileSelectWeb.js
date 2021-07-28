import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { myDarkTheme, myLightTheme } from './../styles/Theme';

export default function FileSelectWeb(props) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? myDarkTheme : myLightTheme;

  const handleFile = event => {
    const file = event.target.files[0]
    console.log(file)
    const isPdf = file.type === 'application/pdf'
    const reader = new FileReader()
    reader.onload = () => {
      const fileData = reader.result
      if (isPdf) {
        console.log('PARSED PDF FILE')
        // const dataArr = new Uint16Array(fileData)
        // console.log('got data array', dataArr)
        // const parsedJson = JSON.stringify(dataArr, null, ' ')
        // console.log('got parsed json', parsedJson)
        // const texted = String.fromCharCode.apply(null, new Uint16Array(fileData))
        // console.log('got text', texted)
      } else {
        console.log("PARSED TEXT FILE")
        props.addTextFromFile(fileData)
        console.log(fileData)
      }
      console.log("END OF FILE")
    }
    if (isPdf) {
      reader.readAsArrayBuffer(file)
    } else {
      reader.readAsText(file)
    }
  }

  const styles = {
    inputContainer: {
      height: '100%',
    },
    input: {
      opacity: 0,
      position: 'absolute',
      zIndex: -1,
      display: 'none'
    },
    label: {
      cursor: 'pointer',
      display: 'flex',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      justifyItems: 'center',
      textAlign: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      marginTop: 0,
      padding: 0,
    }
  }

  return (
    <>
      <label htmlFor='file' style={{...theme.button, ...theme.buttonTitle, ...styles.label}}>Select Text File</label>
      <input type='file' style={{...styles.input}} name='file' id='file' onChange={e => handleFile(e)} />
    </>
  )
}
