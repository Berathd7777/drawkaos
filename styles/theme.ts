import { extendTheme } from '@chakra-ui/react'

const defaultSystemFonts =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
const customFont = `Inter, ${defaultSystemFonts}`

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    body: customFont,
    heading: customFont,
  },
  /*
    Main colors taken from: https://www.happyhues.co/palettes/12
    Shades generated with: https://maketintsandshades.com
  */
  colors: {
    /* paragraph */
    primary: {
      50: '#dce0f6',
      100: '#d4daf4',
      200: '#cdd4f2',
      300: '#c6cdf0',
      400: '#bfc7ee',
      500: '#b8c1ec',
      600: '#a6aed4',
      700: '#939abd',
      800: '#8187a5',
      900: '#6e748e',
    },
    /* headline */
    secondary: {
      50: '#ffffff',
      100: '#fffffe',
      200: '#fffffe',
      300: '#fffffe',
      400: '#fffffe',
      500: '#fffffe',
      600: '#e6e6e5',
      700: '#cccccb',
      800: '#b3b3b2',
      900: '#999998',
    },
    /* button */
    tertiary: {
      50: '#f7dde1',
      100: '#f5d6db',
      200: '#f3cfd5',
      300: '#f1c9cf',
      400: '#f0c2c9',
      500: '#eebbc3',
      600: '#d6a8b0',
      700: '#be969c',
      800: '#a78389',
      900: '#8f7075',
    },
    background: {
      50: '#9194a3',
      100: '#7b7f90',
      200: '#65697e',
      300: '#4f546b',
      400: '#393e59',
      500: '#232946',
      600: '#20253f',
      700: '#1c2138',
      800: '#191d31',
      900: '#15192a',
    },
  },
})

export default theme
