import { createMuiTheme } from '@material-ui/core';

export const THEME = createMuiTheme({
  palette: {
    type: "dark",
    grey: {
      800: "#000000", // overrides failed
      900: "#121212" // overrides success
    },
    background: {
      paper: "#000000"
    },
    primary: {
      light: '#fff',
      main: '#12a8c0',
      dark: '#eee',
      contrastText: '#eee'
    },
    secondary: {
      main: '#40739e',
      dark: '#eee',
      light: '#fff',
      contrastText: '#eee'

    },
  },
  typography: {
    fontFamily: "Raleway, sans- serif",
    fontSize: 20,
    allVariants: {
      color: '#eee'
    }
  },
});