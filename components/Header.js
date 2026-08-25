import React from 'react';
import { useTheme } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/ThemeContext';
import Logo from './Logo';
import GlassView from './GlassView';

export default function Header() {
  const navTheme = useTheme();
  const colors = navTheme?.colors || {};
  const { themeMode, setThemeMode, isDark } = useAppTheme();

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

  const glassBackgroundColor = isDark
    ? 'rgba(46, 52, 64, 0.82)'
    : 'rgba(236, 239, 244, 0.85)';

  return (
    <GlassView
      intensity={60}
      tint={isDark ? 'dark' : 'light'}
      style={[styles.outer, { backgroundColor: glassBackgroundColor, borderBottomColor: colors.border || '#4C566A' }]}
    >
      <View style={styles.inner}>
        <Text style={[styles.titleText, { color: colors.primary || '#5E81AC' }]}>SpdRdr</Text>
      </View>
      <View style={styles.inner}>
        <TouchableOpacity
          style={[styles.themeToggle, { backgroundColor: isDark ? 'rgba(59,66,82,0.7)' : 'rgba(216,222,233,0.7)' }]}
          onPress={cycleTheme}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Theme mode: ${themeLabel}. Tap to change.`}
        >
          <Ionicons name={themeIconName} size={15} color={colors.text || '#D8DEE9'} />
          <Text style={[styles.themeText, { color: colors.text || '#D8DEE9' }]}>{themeLabel}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inner}>
        <Logo />
      </View>
    </GlassView>
  );
}

const styles = StyleSheet.create({
  outer: {
    display: 'flex',
    flexDirection: 'row',
    height: 48,
    alignItems: 'stretch',
    borderBottomWidth: 1,
    zIndex: 10,
  },
  inner: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  themeText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5,
    textTransform: 'capitalize',
  },
});
