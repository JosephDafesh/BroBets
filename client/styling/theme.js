import { createTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#55917F',
    },
    secondary: {
      main: '#FFE2D1',
    },
    background: {
      default: '#E4FDE1', 
    }
  },
  typography: {
    fontFamily: 'Barlow Condensed, sans-serif',
  },
});

export default theme;