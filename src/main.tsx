import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@/styles/global.css';


import { AppRouter } from './app/routes/AppRoutes';
import { AppProviders } from './app/providers/AppProviders';
import { GlobalProvider } from './styles/context/GlobalContext/GlobalContext';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>

        <GlobalProvider>
          <AppRouter />

        </GlobalProvider>
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>,
);