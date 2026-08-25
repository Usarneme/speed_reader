import React, { useState } from 'react';
import { useAppTheme } from '../context/ThemeContext';
import { parseFileToText } from '../utils/fileParsers';

export default function FileSelectWeb(props) {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      console.log('Processing web file upload:', file.name, file.type);
      const extractedText = await parseFileToText(file, file.name);
      console.log('Finished parsing web file, text length:', extractedText.length);
      props.addTextFromFile(extractedText);
    } catch (err) {
      console.error('Error reading file on web:', err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    input: {
      opacity: 0,
      position: 'absolute',
      zIndex: -1,
      display: 'none',
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
      opacity: loading ? 0.7 : 1,
    },
  };

  return (
    <>
      <label htmlFor="file" style={{ ...theme.button, ...theme.buttonTitle, ...styles.label }}>
        {loading ? 'Processing Document...' : 'Select File (.txt, .pdf, .docx, .epub, .md, .rtf)'}
      </label>
      <input
        type="file"
        style={{ ...styles.input }}
        name="file"
        id="file"
        accept=".txt,.pdf,.docx,.odt,.epub,.md,.markdown,.rtf,.html,.htm,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/epub+zip,text/markdown"
        onChange={(e) => handleFile(e)}
        disabled={loading}
      />
    </>
  );
}
