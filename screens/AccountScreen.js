import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../context/ThemeContext';
import firebase from '../firebase';

export default function AccountScreen({ navigation: { navigate } }) {
  const { theme, themeMode, setThemeMode } = useAppTheme();

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (err) {
      console.log('ERROR SIGNING OUT', err);
    }
    navigate('Home');
  };

  const options = [
    { key: 'system', label: 'System Theme' },
    { key: 'light', label: 'Light Theme' },
    { key: 'dark', label: 'Dark Theme' },
  ];

  const styles = StyleSheet.create({
    section: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      color: theme.colors.primary,
    },
    optionButton: {
      padding: 12,
      borderRadius: 6,
      marginBottom: 8,
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
    <View style={theme.container}>
      <KeyboardAwareScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme Settings</Text>
          {options.map((opt) => {
            const isActive = themeMode === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.optionButton, isActive && styles.activeOption]}
                onPress={() => setThemeMode(opt.key)}
              >
                <Text style={[styles.optionText, isActive && styles.activeOptionText]}>
                  {opt.label} {isActive ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={theme.button}
          onPress={signOut}>
          <Text style={theme.buttonTitle}>Sign out</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}
