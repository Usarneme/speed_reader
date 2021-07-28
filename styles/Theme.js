import { Platform } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
// const SpaceMono = require('./../assets/fonts/SpaceMono-Regular.ttf')

const buttonBackgroundColor = '#788eec';
const cursorOnWeb = Platform.OS === 'ios' || Platform.OS === 'android' ? null : { cursor: 'pointer', }

const common = {
  fontSize: 22,
  button: {
    backgroundColor: buttonBackgroundColor,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    height: 42,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    ...cursorOnWeb,
  },
  buttonTitle: {
    textTransform: 'uppercase',
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  },
  heading: {
    marginTop: 9,
    marginBottom: 6,
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
    // borderBottomColor: '#111',
    // borderBottomWidth: 4,
    // borderStyle: 'solid',
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16
  },
  container: {
    margin: 5,
    marginTop: 0,
    padding: 5,
    height: '100%',
  },
  tabMenu: {
    backgroundColor: '#434c5e',
    marginTop: 18,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20
  },
  footerText: {
    fontSize: 16,
  },
  footerLink: {
    color: buttonBackgroundColor,
    fontWeight: "bold",
    fontSize: 16
  }
}

const lightColors = {
  ...DefaultTheme.colors,
  background: 'rgb(220,220,220)',
  border: 'rgb(240,120,120)',
  buttonColor: '#333444',
  card: 'rgb(50,50,50)',
  primary: 'rgb(240,120,120)',
  text: 'rgb(150,200,255)',
}

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
    color: lightColors.primary
  },
  iconColor: lightColors.text,
  iconSize: 28,
  activeTintColor: lightColors.primary,
  inactiveTintColor: lightColors.text,
}

const darkColors = {
  ...DarkTheme.colors,
  background: '#2e3440',    // lowest layer background
  border: '#111',
  buttonColor: '#333444',   // button color, not as light to contrast with lighter dark button backgrounds
  card: '#434c5e',          // higher layer background
  notification: '#4c566a',  // highest layer background
  primary: '#d7ddd8',       // headings text color, should be light to contrast with dark backgrounds
  text: '#fafffb',          // lightest text color
}

export const myDarkTheme = {
  ...DarkTheme,
  ...common,
  heading: {
    ...common.heading,
    color: darkColors.primary,
  },
  colors: darkColors,
  backgroundColor: darkColors.background,
  color: darkColors.text,
  footerText: {
    ...common.footerText,
    color: darkColors.primary
  },
  iconColor: darkColors.text,
  iconSize: 28,
  activeTintColor: darkColors.primary,
  inactiveTintColor: darkColors.text,
}
