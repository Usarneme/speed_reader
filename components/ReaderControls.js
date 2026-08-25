import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import AnimatedPressable from './AnimatedPressable';
import GlassView from './GlassView';

export default function ReaderControls(props) {
  const { theme, isDark } = useAppTheme();
  const { isPlaying, togglePlayPause, wpm, setWpm, setCurrentWordIndex, disableSpeedReader } = props;

  const handleMinus = () => {
    setWpm(prev => Math.max(60, prev - 10));
  };

  const handlePlus = () => {
    setWpm(prev => Math.min(900, prev + 10));
  };

  const glassBackgroundColor = isDark
    ? 'rgba(59, 66, 82, 0.85)'
    : 'rgba(235, 233, 240, 0.9)';

  const styles = StyleSheet.create({
    glassContainer: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border || '#4C566A',
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginVertical: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    primaryControlRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 2,
    },
    playPauseButton: {
      ...theme.button,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 44,
      paddingHorizontal: 28,
      marginHorizontal: 0,
      marginTop: 2,
      marginBottom: 6,
      borderRadius: 22,
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
      padding: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    slider: {
      flex: 1,
      marginHorizontal: 8,
      height: 32,
    },
    wpmDisplay: {
      textAlign: 'center',
      color: theme.colors.text || '#ECEFF4',
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 6,
      opacity: 0.9,
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
      backgroundColor: isDark ? 'rgba(67, 76, 94, 0.5)' : 'rgba(216, 222, 233, 0.6)',
      borderWidth: 1,
      borderColor: theme.colors.border || '#4C566A',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButtonText: {
      color: theme.colors.text || '#ECEFF4',
      fontSize: 13,
      fontWeight: '600',
    },
  });

  return (
    <GlassView
      intensity={70}
      tint={isDark ? 'dark' : 'light'}
      style={[styles.glassContainer, { backgroundColor: glassBackgroundColor }]}
    >
      {/* Primary Play/Pause Action */}
      <View style={styles.primaryControlRow}>
        <AnimatedPressable
          style={styles.playPauseButton}
          onPress={togglePlayPause}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause speed reading' : 'Start speed reading'}
          accessibilityHint="Toggles text playback"
          accessibilityState={{ checked: isPlaying }}
          aria-label={isPlaying ? 'Pause speed reading' : 'Start speed reading'}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color={theme.buttonTitle.color}
          />
          <Text style={styles.playPauseText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </AnimatedPressable>
      </View>

      {/* Speed Adjustment Slider with + / - Buttons */}
      <View style={styles.speedControlsRow}>
        <AnimatedPressable
          style={styles.stepButton}
          onPress={handleMinus}
          accessibilityRole="button"
          accessibilityLabel="Decrease speed"
          accessibilityHint="Decreases reading speed by 10 words per minute"
          aria-label="Decrease speed by 10 words per minute"
        >
          <Ionicons name="remove-circle-outline" size={26} color={theme.colors.text || '#ECEFF4'} />
        </AnimatedPressable>

        <Slider
          style={styles.slider}
          value={wpm}
          minimumValue={60}
          maximumValue={900}
          step={5}
          minimumTrackTintColor={theme.colors.primary || '#88C0D0'}
          maximumTrackTintColor={isDark ? '#4C566A' : '#D8DEE9'}
          thumbTintColor={theme.colors.primary || '#88C0D0'}
          onValueChange={v => setWpm(Math.round(v))}
          accessibilityRole="adjustable"
          accessibilityLabel="Reading speed in words per minute"
          accessibilityValue={{ min: 60, max: 900, now: wpm, text: `${wpm} words per minute` }}
          aria-label="Reading speed slider"
          aria-valuemin={60}
          aria-valuemax={900}
          aria-valuenow={wpm}
        />

        <AnimatedPressable
          style={styles.stepButton}
          onPress={handlePlus}
          accessibilityRole="button"
          accessibilityLabel="Increase speed"
          accessibilityHint="Increases reading speed by 10 words per minute"
          aria-label="Increase speed by 10 words per minute"
        >
          <Ionicons name="add-circle-outline" size={26} color={theme.colors.text || '#ECEFF4'} />
        </AnimatedPressable>
      </View>

      <Text
        style={styles.wpmDisplay}
        accessibilityRole="text"
        accessibilityLabel={`${wpm} words per minute`}
      >
        {wpm} WPM
      </Text>

      {/* Secondary Actions (Restart / Change Text) */}
      <View style={styles.secondaryActionsRow}>
        <AnimatedPressable
          style={styles.secondaryButton}
          onPress={() => setCurrentWordIndex(0)}
          accessibilityRole="button"
          accessibilityLabel="Restart reading"
          accessibilityHint="Resets speed reader playback to the first word"
          aria-label="Restart reading"
        >
          <Text style={styles.secondaryButtonText}>Restart</Text>
        </AnimatedPressable>

        <AnimatedPressable
          style={styles.secondaryButton}
          onPress={disableSpeedReader}
          accessibilityRole="button"
          accessibilityLabel="Change text"
          accessibilityHint="Exits reader view to select or paste a new document"
          aria-label="Change text document"
        >
          <Text style={styles.secondaryButtonText}>Change Text</Text>
        </AnimatedPressable>
      </View>
    </GlassView>
  );
}
