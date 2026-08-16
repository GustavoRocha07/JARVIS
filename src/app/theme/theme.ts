import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E3A8A',
    },
    secondary: {
      main: '#64748B',
    },
    background: {
      default: '#F8FAFC',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});