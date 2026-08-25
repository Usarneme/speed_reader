import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAppTheme } from '../context/ThemeContext';
import { parseFileToText } from '../utils/fileParsers';
import AnimatedPressable from './AnimatedPressable';

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
    <View style={styles.container}>
      <AnimatedPressable
        onPress={getLocalFile}
        style={theme.button}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Select file to speed read"
        accessibilityHint="Opens file picker to select a document"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={theme.buttonTitle}>Select File</Text>
        )}
      </AnimatedPressable>

      <Text style={[styles.allowedText, { color: theme.colors.textMuted || '#71717A' }]}>
        Allowed file types: .txt, .pdf, .docx, .epub, .odt, .rtf, .md, .html
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  allowedText: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
});
