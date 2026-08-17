import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { myDarkTheme, myLightTheme } from '../styles/Theme';

const THEME_STORAGE_KEY = '@user_theme_mode';

const ThemeContext = createContext({
  themeMode: 'system', // 'system' | 'light' | 'dark'
  setThemeMode: () => {},
  theme: myLightTheme,
  isDark: false,
});

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadThemePreference() {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && ['system', 'light', 'dark'].includes(savedMode)) {
          setThemeModeState(savedMode);
        }
      } catch (e) {
        console.warn('Failed to load theme preference from storage', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadThemePreference();
  }, []);

  const setThemeMode = async (mode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Failed to save theme preference to storage', e);
    }
  };

  const effectiveScheme = themeMode === 'system' ? (systemColorScheme || 'light') : themeMode;
  const theme = effectiveScheme === 'dark' ? myDarkTheme : myLightTheme;
  const isDark = effectiveScheme === 'dark';

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, theme, isDark, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
