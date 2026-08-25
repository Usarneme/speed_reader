import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../context/ThemeContext';

const themeOptions = [
  { key: 'system', label: 'System Theme' },
  { key: 'light', label: 'Light Theme' },
  { key: 'dark', label: 'Dark Theme' },
];

const shortcutItems = [
  { keyCombo: 'Space  or  K', action: 'Play / Pause speed reading' },
  { keyCombo: '↑  or  →', action: 'Increase speed (+10 WPM)' },
  { keyCombo: '↓  or  ←', action: 'Decrease speed (-10 WPM)' },
  { keyCombo: 'R', action: 'Restart reading from start' },
  { keyCombo: 'Esc', action: 'Exit reader / Change text' },
];

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor || theme.colors.background }]}>
      <KeyboardAwareScrollView>
        {/* Appearance & Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]} accessibilityRole="header">
            Appearance & Theme
          </Text>
          {themeOptions.map((opt) => {
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
                accessibilityRole="button"
                accessibilityLabel={`${opt.label}${isActive ? ', selected' : ''}`}
                accessibilityState={{ selected: isActive }}
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

        {/* Keyboard Controls Cheat Sheet Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]} accessibilityRole="header">
            Keyboard Shortcuts & Controls
          </Text>
          <View style={[styles.shortcutCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            {shortcutItems.map((item, index) => (
              <View
                key={item.keyCombo}
                style={[
                  styles.shortcutRow,
                  index < shortcutItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
                ]}
                accessibilityRole="text"
                accessibilityLabel={`Shortcut ${item.keyCombo}: ${item.action}`}
              >
                <View style={[styles.keyBadge, { backgroundColor: theme.colors.background }]}>
                  <Text style={[styles.keyText, { color: theme.colors.primary }]}>{item.keyCombo}</Text>
                </View>
                <Text style={[styles.actionText, { color: theme.colors.text }]}>{item.action}</Text>
              </View>
            ))}
          </View>
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
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
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
  shortcutCard: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  shortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  keyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  keyText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Platform.OS === "web" ? "monospace" : undefined',
  },
  actionText: {
    fontSize: 14,
    flex: 1,
    marginLeft: 14,
    textAlign: 'right',
  },
});
