import { DarkTheme, DefaultTheme } from '@react-navigation/native';

const common = {
  fontFamily: 'Roboto',
  fontFamily: 'Menlo',
  fontSize: 22,
  button: {
    width: '100%',
    borderRadius: 0,
    margin: 5,
    marginTop: 8,
    padding: 10,
    textTransform: 'uppercase',
    fontSize: 20,
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
    minHeight: 28,
    backgroundColor: '#333344',
    fontSize: 24,
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

export const myLightTheme = {
  ...DefaultTheme,
  ...common,
  backgroundColor: 'rgb(220,220,220)',
  colors: {
    ...DefaultTheme.colors,
    background: 'rgb(220,220,220)',
    primary: 'rgb(240,120,120)',
    text: 'rgb(150,200,255)',
    card: 'rgb(50,50,50)',
    border: 'rgb(240,120,120)'
  }
}

export const myDarkTheme = {
  ...DarkTheme,
  ...common,
  backgroundColor: '#2e3440',
  colors: {
    ...DarkTheme.colors,
    background: '#2e3440',    // lowest layer background
    border: '#111',
    card: '#434c5e',          // higher layer background
    notification: '#4c566a',  // highest layer background
    primary: '#d8dee9',       // headings text color, should be light to contrast with dark backgrounds
    buttonColor: '#333444',   // button color, not as light to contrast with lighter dark button backgrounds
    text: '#e5e9f0',          // lightest text color
  }
}
