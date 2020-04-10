import { createMuiTheme } from '@material-ui/core/styles';
const theme = createMuiTheme({
    /**palette: createPalette({
          type: 'dark', // Switching the dark mode on is a single property value change.
          primary: green
      }), */
    palette: {
      type:'dark',
      primary: {
        light: '#80cbc4',
        //6E4E7F purple
        main: '#6FB2E3',
        dark: '#273e5c',
        contrastText: '#fff'
      },
      secondary: {
        light: '#f6a5c0',
        main: '#8DCCA2',
        dark: '#aa647b',
        contrastText: '#000',
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
      primaryText: {
        main: '#6FB2E3',
      }
    },
  });
  export default theme;