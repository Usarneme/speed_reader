import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useAppTheme();

  const options = [
    { key: 'system', label: 'System Theme' },
    { key: 'light', label: 'Light Theme' },
    { key: 'dark', label: 'Dark Theme' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor || theme.colors.background,
    },
    section: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.colors.primary,
    },
    optionButton: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    activeOption: {
      borderColor: theme.activeTintColor || '#788eec',
      backgroundColor: theme.colors.background,
    },
    optionText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    activeOptionText: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    }
  });

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance & Theme</Text>
          {options.map((opt) => {
            const isActive = themeMode === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.optionButton, isActive && styles.activeOption]}
                onPress={() => setThemeMode(opt.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.optionText, isActive && styles.activeOptionText]}>
                  {opt.label} {isActive ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
