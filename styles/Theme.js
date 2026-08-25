import { Platform } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

/**
 * Official Nord Color Palette Tokens
 * https://www.nordtheme.com/docs/colors-and-palettes
 */
export const NORD = {
  // Polar Night
  nord0: '#2E3440',
  nord1: '#3B4252',
  nord2: '#434C5E',
  nord3: '#4C566A',
  // Snow Storm
  nord4: '#D8DEE9',
  nord5: '#E5E9F0',
  nord6: '#ECEFF4',
  // Frost (Accents)
  nord7: '#8FBCBB',
  nord8: '#88C0D0',
  nord9: '#81A1C1',
  nord10: '#5E81AC',
};

const primaryColor = NORD.nord10; // #5E81AC (Nord Deep Steel Blue)
const primaryColorDark = NORD.nord8; // #88C0D0 (Nord Ice Frost)
const cursorOnWeb = Platform.OS === 'ios' || Platform.OS === 'android' ? null : { cursor: 'pointer' };

const common = {
  fontSize: 22,
  button: {
    backgroundColor: primaryColor,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: primaryColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    ...cursorOnWeb,
  },
  buttonTitle: {
    textTransform: 'uppercase',
    color: '#ECEFF4',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heading: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '800',
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  input: {
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: NORD.nord5,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 16,
  },
  container: {
    padding: 10,
    flex: 1,
  },
  tabMenu: {
    backgroundColor: NORD.nord1,
    marginTop: 18,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    color: primaryColor,
    fontWeight: 'bold',
    fontSize: 15,
  },
};

const lightColors = {
  ...DefaultTheme.colors,
  background: NORD.nord6, // #ECEFF4 (Snow Storm background)
  border: NORD.nord4,     // #D8DEE9
  buttonColor: primaryColor,
  card: '#FFFFFF',
  primary: primaryColor,  // #5E81AC
  text: NORD.nord0,        // #2E3440 (Polar Night text)
  textMuted: NORD.nord3,   // #4C566A
  input: '#FFFFFF',
};

export const myLightTheme = {
  ...DefaultTheme,
  ...common,
  heading: {
    ...common.heading,
    color: lightColors.primary,
  },
  colors: lightColors,
  backgroundColor: lightColors.background,
  color: lightColors.text,
  footerText: {
    ...common.footerText,
    color: lightColors.primary,
  },
  iconColor: lightColors.text,
  iconSize: 24,
  activeTintColor: lightColors.primary,
  inactiveTintColor: lightColors.textMuted,
  input: {
    ...common.input,
    backgroundColor: lightColors.input,
  },
};

const darkColors = {
  ...DarkTheme.colors,
  background: NORD.nord0, // #2E3440 (Polar Night background)
  border: NORD.nord3,     // #4C566A
  buttonColor: primaryColorDark,
  card: NORD.nord1,       // #3B4252 (Polar Surface Card)
  notification: NORD.nord2,
  primary: primaryColorDark, // #88C0D0 (Frost Ice Blue)
  text: NORD.nord6,        // #ECEFF4 (Snow Storm text)
  textMuted: NORD.nord4,   // #D8DEE9
  input: NORD.nord1,
};

export const myDarkTheme = {
  ...DarkTheme,
  ...common,
  heading: {
    ...common.heading,
    color: darkColors.primary,
  },
  button: {
    ...common.button,
    backgroundColor: primaryColorDark,
    shadowColor: primaryColorDark,
  },
  colors: darkColors,
  backgroundColor: darkColors.background,
  color: darkColors.text,
  footerText: {
    ...common.footerText,
    color: darkColors.primary,
  },
  iconColor: darkColors.text,
  iconSize: 24,
  activeTintColor: darkColors.primary,
  inactiveTintColor: darkColors.textMuted,
  input: {
    ...common.input,
    backgroundColor: darkColors.input,
  },
};
