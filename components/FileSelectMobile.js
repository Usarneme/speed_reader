import React, { useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAppTheme } from '../context/ThemeContext';
import { parseFileToText } from '../utils/fileParsers';

export default function FileSelectMobile(props) {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(false);

  const getLocalFile = async () => {
    console.log('get local file clicked');
    try {
      const chosenFile = await DocumentPicker.getDocumentAsync({
        type: [
          'text/plain',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          'application/vnd.oasis.opendocument.text',
          'application/rtf',
          'text/rtf',
          'application/epub+zip',
          'text/markdown',
          '*/*',
        ],
        copyToCacheDirectory: true,
      });

      if (!chosenFile || chosenFile.canceled || chosenFile.type === 'cancel') {
        console.log('no file chosen');
        return;
      }

      const asset = chosenFile.assets ? chosenFile.assets[0] : chosenFile;
      let uri = asset.uri;
      const name = asset.name || 'document.txt';

      if (uri && uri.substring(0, 4) !== 'file' && uri.substring(0, 4) !== 'http') {
        uri = 'file:' + uri;
      }

      await readFileContent(uri, name);
    } catch (err) {
      console.log('ERROR GETTING FILE', err);
    }
  };

  const readFileContent = async (fileUri, fileName) => {
    console.log('reading file from ', fileUri, 'name:', fileName);
    if (!fileUri) return;
    setLoading(true);
    try {
      const extractedText = await parseFileToText(fileUri, fileName);
      console.log(`finished reading file, length: ${extractedText.length}`);
      props.addTextFromFile(extractedText);
    } catch (err) {
      console.log('ERROR reading file', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={getLocalFile} style={theme.button} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={theme.buttonTitle}>Select File (.txt, .pdf, .docx, .epub, .md, .rtf)</Text>
      )}
    </TouchableOpacity>
  );
}
