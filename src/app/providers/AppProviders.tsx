import { type ReactNode } from 'react';

import { CssBaseline, ThemeProvider } from '@mui/material';


import { theme } from '@/app/theme/theme';
import { AlertProvider } from '@/context/AlertContext/AlertProvider';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {

  return (

    <ThemeProvider theme={theme}>
      <AlertProvider>

        <CssBaseline />
        {children}
      </AlertProvider>

    </ThemeProvider>

  );
}