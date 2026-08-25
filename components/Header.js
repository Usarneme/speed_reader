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

  const themeIconName =
    themeMode === 'light'
      ? 'sunny-outline'
      : themeMode === 'dark'
        ? 'moon-outline'
        : 'color-palette-outline';

  const themeLabel = themeMode === 'system' ? 'System' : themeMode === 'light' ? 'Light' : 'Dark';

  return (
    <View style={[styles.outer, { backgroundColor: colors.background || '#eee' }]}>
      <View style={[styles.inner, { backgroundColor: colors.card || '#f7f7f7' }]}>
        <Text style={[styles.text, { color: colors.primary || '#333' }]}>SpdRdr</Text>
      </View>
      <View style={[styles.inner, { backgroundColor: colors.card || '#f7f7f7' }]}>
        <TouchableOpacity
          style={[styles.themeToggle, { backgroundColor: colors.background || '#eee' }]}
          onPress={cycleTheme}
          activeOpacity={0.7}
        >
          <Ionicons name={themeIconName} size={16} color={colors.text || '#666'} />
          <Text style={[styles.themeText, { color: colors.text || '#666' }]}>{themeLabel}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.inner, { backgroundColor: colors.card || '#f7f7f7' }]}>
        <Logo />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    display: 'flex',
    flexDirection: 'row',
    height: 46,
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inner: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  themeText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
});
