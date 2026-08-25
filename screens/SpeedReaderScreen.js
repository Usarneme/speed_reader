import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

import ReaderControls from '../components/ReaderControls';
import FileSelect from '../components/FileSelect';
import AnimatedPressable from '../components/AnimatedPressable';

export default function HomeScreen() {
  const { theme } = useAppTheme();

  const [inputShowing, showInput] = useState(true);
  const [readerShowing, showReader] = useState(false);
  const [controlsShowing, showControls] = useState(false);
  const [isPlaying, setPlaying] = useState(false);

  const [text, setText] = useState('');
  const [textArray, setTextArray] = useState([]);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wpm, setWpm] = useState(300); // Words Per Minute

  const intervalRef = useRef(null);

  // Clean, leak-proof interval effect using functional state updates and exact array reference
  useEffect(() => {
    if (isPlaying && textArray.length > 0) {
      const delayMs = Math.round(60000 / wpm);

      intervalRef.current = setInterval(() => {
        setCurrentWordIndex(prevIndex => {
          if (prevIndex >= textArray.length - 1) {
            setPlaying(false);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, delayMs);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, wpm, textArray]);

  const togglePlayPause = () => {
    if (isPlaying) {
      setPlaying(false);
    } else {
      if (currentWordIndex >= textArray.length - 1) {
        setCurrentWordIndex(0);
      }
      setPlaying(true);
    }
  };

  const enableSpeedReader = () => {
    setPlaying(true);
    showInput(false);
    showControls(true);
    showReader(true);
  };

  const disableSpeedReader = () => {
    setPlaying(false);
    showInput(true);
    showControls(false);
    showReader(false);
  };

  // Keyboard Shortcuts Listener for Web & Desktop/Tablet
  useEffect(() => {
    if (Platform.OS !== 'web' || !readerShowing) return;

    const handleKeyDown = (event) => {
      const targetTag = event.target?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      switch (event.key) {
        case ' ':
        case 'k':
        case 'K':
          event.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowUp':
        case 'ArrowRight':
          event.preventDefault();
          setWpm(prev => Math.min(900, prev + 10));
          break;
        case 'ArrowDown':
        case 'ArrowLeft':
          event.preventDefault();
          setWpm(prev => Math.max(60, prev - 10));
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          setCurrentWordIndex(0);
          break;
        case 'Escape':
          event.preventDefault();
          disableSpeedReader();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readerShowing, isPlaying, togglePlayPause, disableSpeedReader]);

  const changeText = text => {
    setText(text);
    setCurrentWordIndex(0);
  };

  const speedReadInputText = () => {
    if (!text.trim()) return;
    const words = text.trim().split(/\s+/).filter(Boolean);
    setTextArray(words);
    setCurrentWordIndex(0);
    enableSpeedReader();
  };

  const speedReadTextFromFile = text => {
    changeText(text);
    const words = text.trim().split(/\s+/).filter(Boolean);
    setTextArray(words);
    setCurrentWordIndex(0);
    enableSpeedReader();
  };

  const clearText = () => {
    setText('');
    setTextArray([]);
    setCurrentWordIndex(0);
  };

  const totalWords = textArray.length;
  const currentWordDisplay = totalWords > 0 ? currentWordIndex + 1 : 0;
  const progressPercent = totalWords > 0 ? (currentWordDisplay / totalWords) * 100 : 0;
  const currentWord = textArray[currentWordIndex] || '';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 8,
    },
    inputContainer: {
      flex: 1,
    },
    textInput: {
      flex: 1,
      backgroundColor: '#ddd',
      padding: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderStyle: 'solid',
      fontSize: 16,
      color: '#000',
      borderRadius: 6,
      marginBottom: 10,
    },
    readerContainer: {
      flex: 1,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: 8,
      marginVertical: 4,
      padding: 16,
      position: 'relative',
      overflow: 'hidden',
    },
    focalGuideTop: {
      position: 'absolute',
      top: '25%',
      width: 40,
      height: 3,
      backgroundColor: theme.colors.primary || '#788eec',
      borderRadius: 2,
      opacity: 0.6,
    },
    focalGuideBottom: {
      position: 'absolute',
      bottom: '25%',
      width: 40,
      height: 3,
      backgroundColor: theme.colors.primary || '#788eec',
      borderRadius: 2,
      opacity: 0.6,
    },
    readerText: {
      fontSize: 58,
      fontWeight: '900',
      color: theme.colors.text || '#000',
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    progressBarContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: theme.colors.primary || '#788eec',
    },
    progressText: {
      position: 'absolute',
      bottom: 8,
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text || '#666',
      opacity: 0.75,
    },
    divider: {
      width: '100%',
      textAlign: 'center',
      color: theme.colors.text || '#000',
      padding: 4,
    },
  });

  return (
    <View style={[theme.container, styles.container]}>
      {inputShowing && (
        <View style={styles.inputContainer}>
          <Text style={theme.heading} accessibilityRole="header">
            Enter Text
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Welcome to SpdRdr the speed reader app! Paste or select text to speed read it!"
            placeholderTextColor="#777"
            onChangeText={t => changeText(t)}
            value={text}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            multiline={true}
            accessibilityLabel="Speed reader text input field"
            accessibilityHint="Paste or type document text here to speed read"
          />
          {text.length > 0 && (
            <View style={{ marginBottom: 8 }}>
              <AnimatedPressable
                style={theme.button}
                onPress={clearText}
                accessibilityRole="button"
                accessibilityLabel="Clear input text"
                aria-label="Clear input text"
              >
                <Text style={theme.buttonTitle}>Clear Text</Text>
              </AnimatedPressable>
            </View>
          )}
          <AnimatedPressable
            style={theme.button}
            onPress={speedReadInputText}
            disabled={!text.trim()}
            accessibilityRole="button"
            accessibilityLabel="Speed read input text"
            accessibilityHint="Begins speed reader playback for the typed or pasted text"
            aria-label="Speed read input text"
          >
            <Text style={theme.buttonTitle}>Speed Read Input Text</Text>
          </AnimatedPressable>
          <Text style={styles.divider}>or</Text>
          <FileSelect addTextFromFile={speedReadTextFromFile} />
        </View>
      )}

      {readerShowing && (
        <View
          style={styles.readerContainer}
          accessibilityRole="summary"
          accessibilityLabel={`Speed reader display. Current word: ${currentWord}. Word ${currentWordDisplay} of ${totalWords}`}
        >
          <View style={styles.focalGuideTop} />
          <Text
            style={styles.readerText}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            minimumFontScale={0.3}
            accessibilityRole="text"
            accessibilityLiveRegion="polite"
            aria-live="polite"
            accessibilityLabel={currentWord}
          >
            {currentWord}
          </Text>
          <View style={styles.focalGuideBottom} />

          {/* Progress Bar & Counter */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          {totalWords > 0 && (
            <Text
              style={styles.progressText}
              accessibilityRole="text"
              accessibilityLabel={`Word ${currentWordDisplay} of ${totalWords}, ${Math.round(progressPercent)} percent complete`}
            >
              Word {currentWordDisplay} of {totalWords} ({Math.round(progressPercent)}%)
            </Text>
          )}
        </View>
      )}

      {controlsShowing && (
        <ReaderControls
          disableSpeedReader={disableSpeedReader}
          isPlaying={isPlaying}
          togglePlayPause={togglePlayPause}
          wpm={wpm}
          setWpm={setWpm}
          setCurrentWordIndex={setCurrentWordIndex}
        />
      )}
    </View>
  );
}
