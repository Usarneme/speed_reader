import { DarkTheme, DefaultTheme } from '@react-navigation/native';

const common = {
  fontFamily: 'Roboto',
  fontFamily: 'Menlo',
  fontSize: 22,
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
    borderBottomColor: '#111',
    borderBottomWidth: 4,
    borderStyle: 'solid',
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
    padding: 5,
  },
  tabMenu: {
    backgroundColor: '#434c5e',
    marginTop: 18,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  }
}

const lightColors = {
  ...DefaultTheme.colors,
  background: 'rgb(220,220,220)',
  primary: 'rgb(240,120,120)',
  text: 'rgb(150,200,255)',
  card: 'rgb(50,50,50)',
  border: 'rgb(240,120,120)'
}

const darkColors = {
  ...DarkTheme.colors,
  background: '#2e3440',    // lowest layer background
  border: '#111',
  card: '#434c5e',          // higher layer background
  notification: '#4c566a',  // highest layer background
  primary: '#d8dee9',       // headings text color, should be light to contrast with dark backgrounds
  buttonColor: '#333444',   // button color, not as light to contrast with lighter dark button backgrounds
  text: '#e5e9f0',          // lightest text color
}

export const myLightTheme = {
  ...DefaultTheme,
  ...common,
  lightColors,
  backgroundColor: lightColors.background,
  color: lightColors.primary,
}

export const myDarkTheme = {
  ...DarkTheme,
  ...common,
  darkColors,
  backgroundColor: darkColors.background,
  color: darkColors.primary,
}
