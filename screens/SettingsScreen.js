import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../context/ThemeContext';

const options = [
  { key: 'system', label: 'System Theme' },
  { key: 'light', label: 'Light Theme' },
  { key: 'dark', label: 'Dark Theme' },
];

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor || theme.colors.background }]}>
      <KeyboardAwareScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Appearance & Theme</Text>
          {options.map((opt) => {
            const isActive = themeMode === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.optionButton,
                  {
                    borderColor: isActive ? theme.activeTintColor || '#788eec' : theme.colors.border,
                    backgroundColor: isActive ? theme.colors.background : theme.colors.card,
                  },
                ]}
                onPress={() => setThemeMode(opt.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: isActive ? theme.colors.primary : theme.colors.text,
                      fontWeight: isActive ? 'bold' : 'normal',
                    },
                  ]}
                >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
});
