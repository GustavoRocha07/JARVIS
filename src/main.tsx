import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@/styles/global.css';


import { AppRouter } from './app/routes/AppRoutes';
import { AppProviders } from './app/providers/AppProviders';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './shared/libs/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProviders>

          <AppRouter />

        </AppProviders>
        <ReactQueryDevtools />
      </BrowserRouter>
    </QueryClientProvider>

  </React.StrictMode>,
);