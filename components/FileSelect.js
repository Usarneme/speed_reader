import React from 'react';
import { Platform } from 'react-native';

import FileSelectMobile from './FileSelectMobile';
import FileSelectWeb from './FileSelectWeb';

export default function FileUploads(props) {
  return (
    <>
      { Platform.OS === 'ios' || Platform.OS === 'android' ?
        <FileSelectMobile addTextFromFile={props.changeText} />
        :
        <FileSelectWeb addTextFromFile={props.changeText} />
      }
    </>
  )
}
