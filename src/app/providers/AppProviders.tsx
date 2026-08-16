import { type ReactNode } from 'react';

import { CssBaseline, ThemeProvider } from '@mui/material';


import { theme } from '@/app/theme/theme';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {

  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />

      {children}
    </ThemeProvider>

  );
}