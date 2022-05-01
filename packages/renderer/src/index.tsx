import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './contexts/theme';
import rootRoute from './routes';
import './index.css';
import './vditor.css';

ReactDOM.render(
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        {rootRoute.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root'),
);
