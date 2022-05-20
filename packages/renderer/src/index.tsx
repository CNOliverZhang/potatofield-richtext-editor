import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './contexts/theme';
import rootRoute from './routes';
import './index.css';
import './vditor.css';

ReactDOM.render(
  <ThemeProvider>
    <HashRouter>
      <Routes>
        {rootRoute.map((route) => (
          <Route key={route.path} {...route} />
        ))}
      </Routes>
    </HashRouter>
  </ThemeProvider>,
  document.getElementById('root'),
);
