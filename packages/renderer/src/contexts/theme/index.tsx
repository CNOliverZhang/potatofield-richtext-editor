import React, { useState, useEffect, useContext } from 'react';
import {
  createTheme,
  Theme,
  CssBaseline,
  ThemeProvider as MaterialThemeProvider,
} from '@mui/material';
import { blue, orange } from '@mui/material/colors';

import font from '@/assets/fonts/NotoSansSC-Thin.woff';

const NotoSansSC = {
  fontFamily: 'Noto Sans SC Thin',
  fontStyle: 'normal',
  fontWeight: 100,
  src: `url(${font}) format('woff')`,
};

interface ThemeContext {
  theme: Theme;
  darkMode: boolean | 'auto';
  setDarkMode: (option: boolean | 'auto') => void;
  getDarkMode: () => boolean;
}

const themeContext = React.createContext<ThemeContext>({
  theme: createTheme({
    palette: {
      primary: blue,
      secondary: orange,
      mode: 'dark',
    },
  }),
  darkMode: 'auto',
  setDarkMode: () => undefined,
  getDarkMode: () => true,
});

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = (props: { children: React.ReactNode }) => {
  const [darkModeState, setDarkModeState] = useState<boolean | 'auto'>('auto');
  const { children } = props;

  const setDarkMode = (darkMode: boolean | 'auto') => {
    if (!darkMode) {
      window.localStorage.setItem('darkMode', '0');
    } else if (darkMode === true) {
      window.localStorage.setItem('darkMode', '1');
    } else {
      window.localStorage.removeItem('darkMode');
    }
    setDarkModeState(darkMode);
  };

  const getDarkMode = () =>
    localStorage.getItem('darkMode')
      ? Boolean(Number(localStorage.getItem('darkMode')))
      : matchMedia('(prefers-color-scheme: dark)').matches;

  const theme = createTheme({
    palette: {
      primary: blue,
      secondary: orange,
      mode: getDarkMode() ? 'dark' : 'light',
      background: {
        default: getDarkMode() ? '#121212' : '#f5f5f5',
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 640,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    typography: {
      fontFamily: 'Noto Sans SC Thin',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            FontFace: [NotoSansSC],
          },
        },
      },
    },
  });

  useEffect(() => {
    setDarkMode(
      localStorage.getItem('darkMode') ? Boolean(Number(localStorage.getItem('darkMode'))) : 'auto',
    );
  }, []);

  return (
    <themeContext.Provider
      value={{
        theme,
        darkMode: darkModeState,
        setDarkMode,
        getDarkMode,
      }}
    >
      <MaterialThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MaterialThemeProvider>
    </themeContext.Provider>
  );
};

const useTheme = (): ThemeContext => useContext(themeContext);

export default useTheme;
