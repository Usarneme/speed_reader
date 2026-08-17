import React from 'react';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import Logo from './Logo';

export default function Header() {
  const navTheme = useTheme();
  const colors = navTheme?.colors || {};
  const { themeMode, setThemeMode } = useAppTheme();

  const cycleTheme = () => {
    if (themeMode === 'system') setThemeMode('light');
    else if (themeMode === 'light') setThemeMode('dark');
    else setThemeMode('system');
  };

  const themeIconName = themeMode === 'light' 
    ? 'sunny-outline' 
    : themeMode === 'dark' 
      ? 'moon-outline' 
      : 'color-palette-outline';

  const themeLabel = themeMode === 'system' ? 'System' : themeMode === 'light' ? 'Light' : 'Dark';

  const styles = StyleSheet.create({
    outer: {
      display: 'flex',
      flexDirection: 'row',
      height: 59,
      alignItems: 'stretch',
      backgroundColor: colors.background || '#eee',
    },
    inner: {
      backgroundColor: colors.card || '#f7f7f7',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 35,
      fontWeight: 'bold',
      color: colors.primary || '#333',
    },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      backgroundColor: colors.background || '#eee',
    },
    themeText: {
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
      color: colors.text || '#666',
      textTransform: 'capitalize',
    }
  });

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.text}>SpdRdr</Text>
      </View>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.themeToggle} onPress={cycleTheme} activeOpacity={0.7}>
          <Ionicons name={themeIconName} size={20} color={colors.text || '#666'} />
          <Text style={styles.themeText}>{themeLabel}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inner}>
        <Logo />
      </View>
    </View>
  );
}
