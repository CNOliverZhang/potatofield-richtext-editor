import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './contexts/theme';
import rootRoute from './routes';
import './vditor.css';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
  <ThemeProvider>
    <HashRouter>
      <Routes>
        {rootRoute.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </HashRouter>
  </ThemeProvider>,
);
