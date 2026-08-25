import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';

export default function ReaderControls(props) {
  const { theme } = useAppTheme();
  const { isPlaying, togglePlayPause, wpm, setWpm, setCurrentWordIndex, disableSpeedReader } = props;

  const handleMinus = () => {
    setWpm(prev => Math.max(60, prev - 10));
  };

  const handlePlus = () => {
    setWpm(prev => Math.min(900, prev + 10));
  };

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 6,
      paddingHorizontal: 4,
    },
    primaryControlRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 4,
    },
    playPauseButton: {
      ...theme.button,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 44,
      paddingHorizontal: 24,
      marginHorizontal: 0,
      marginTop: 4,
      marginBottom: 6,
    },
    playPauseText: {
      ...theme.buttonTitle,
      marginLeft: 8,
      fontSize: 16,
      fontWeight: 'bold',
    },
    speedControlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: 4,
      marginVertical: 2,
    },
    stepButton: {
      padding: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    slider: {
      flex: 1,
      marginHorizontal: 6,
      height: 32,
    },
    wpmDisplay: {
      textAlign: 'center',
      color: theme.colors.text || '#fff',
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 6,
      opacity: 0.85,
    },
    secondaryActionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    secondaryButton: {
      flex: 1,
      height: 36,
      marginHorizontal: 4,
      marginTop: 0,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border || '#888',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButtonText: {
      color: theme.colors.text || '#fff',
      fontSize: 13,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      {/* Primary Play/Pause Action */}
      <View style={styles.primaryControlRow}>
        <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause} activeOpacity={0.8}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color={theme.buttonTitle.color}
          />
          <Text style={styles.playPauseText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
      </View>

      {/* Speed Adjustment Slider with + / - Buttons */}
      <View style={styles.speedControlsRow}>
        <TouchableOpacity style={styles.stepButton} onPress={handleMinus}>
          <Ionicons name="remove-circle-outline" size={26} color={theme.colors.text || '#fff'} />
        </TouchableOpacity>

        <Slider
          style={styles.slider}
          value={wpm}
          minimumValue={60}
          maximumValue={900}
          step={5}
          minimumTrackTintColor={theme.colors.primary || '#007AFF'}
          maximumTrackTintColor="#ccc"
          thumbTintColor={theme.colors.primary || '#007AFF'}
          onValueChange={v => setWpm(Math.round(v))}
        />

        <TouchableOpacity style={styles.stepButton} onPress={handlePlus}>
          <Ionicons name="add-circle-outline" size={26} color={theme.colors.text || '#fff'} />
        </TouchableOpacity>
      </View>

      <Text style={styles.wpmDisplay}>{wpm} WPM</Text>

      {/* Secondary Actions (Restart / Change Text) */}
      <View style={styles.secondaryActionsRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentWordIndex(0)}>
          <Text style={styles.secondaryButtonText}>Restart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={disableSpeedReader}>
          <Text style={styles.secondaryButtonText}>Change Text</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
