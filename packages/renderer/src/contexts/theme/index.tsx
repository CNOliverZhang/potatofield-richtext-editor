import React, { useState, useContext } from 'react';
import { CssBaseline, createTheme, ThemeProvider as MaterialThemeProvider } from '@mui/material';
import { blue, orange } from '@mui/material/colors';

import Storage from '@/store';

import font from '@/assets/fonts/NotoSansSC-Thin.woff';

const NotoSansSC = {
  fontFamily: 'Noto Sans SC Thin',
  fontStyle: 'normal',
  fontWeight: 100,
  src: `url(${font}) format('woff')`,
};

interface ThemeContext {
  darkMode: boolean;
  setDarkMode: (option: boolean) => void;
}

const themeContext = React.createContext<ThemeContext>({
  darkMode: false,
  setDarkMode: () => undefined,
});

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const storage = Storage();
  const [darkMode, setDarkMode] = useState<boolean>(storage.settings.getDarkMode());

  storage.settings.watchDarkMode((value) => {
    setDarkMode(value);
  });

  const theme = createTheme({
    palette: {
      primary: blue,
      secondary: orange,
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#1d1d1d' : '#f5f5f5',
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

  return (
    <themeContext.Provider
      value={{
        darkMode,
        setDarkMode: storage.settings.setDarkMode,
      }}
    >
      <MaterialThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MaterialThemeProvider>
    </themeContext.Provider>
  );
};

const useThemeContext = (): ThemeContext => useContext(themeContext);

export default useThemeContext;
