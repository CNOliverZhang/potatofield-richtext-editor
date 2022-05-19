import Store from 'electron-store';

const themes = (store: Store) => {
  const setThemeList = (themeList: Theme[]) => {
    store.set('themeList', themeList);
  };

  const getThemeList = () => {
    return (store.get('themeList') as Theme[]) || [];
  };

  const addTheme = (theme: Theme) => {
    store.set('themeList', [...((store.get('themeList') as Theme[]) || []), theme]);
  };

  const removeTheme = (themeId: string) => {
    const themeList = (store.get('themeList') as Theme[]) || [];
    const index = themeList.findIndex((item) => item.id === themeId);
    if (index >= 0) {
      themeList.splice(index, 1);
      store.set('themeList', themeList);
    }
  };

  const updateTheme = (themeId: string, updatedTheme: Theme) => {
    const themeList = (store.get('themeList') as Theme[]) || [];
    const index = themeList.findIndex((item) => item.id === themeId);
    if (index >= 0) {
      themeList.splice(index, 1, updatedTheme);
      store.set('themeList', themeList);
    }
  };

  const watchThemeList = (callback: (themeList: Theme[], oldThemeList: Theme[]) => void) => {
    store.onDidChange('themeList', (newValue, oldValue) => {
      callback(newValue as Theme[], oldValue as Theme[]);
    });
  };

  const setDefaultThemeId = (themeId: string) => {
    store.set('defaultThemeId', themeId);
  };

  const getDefaultThemeId = () => {
    return store.get('defaultThemeId') as string;
  };

  const watchDefaultThemeId = (callback: (themeId: string, oldThemeId: string) => void) => {
    store.onDidChange('defaultThemeId', (newValue, oldValue) => {
      callback(newValue as string, oldValue as string);
    });
  };

  const setDefaultHljsTheme = (theme: string) => {
    store.set('defaultHljsTheme', theme);
  };

  const getDefaultHljsTheme = () => {
    return store.get('defaultHljsTheme') as string;
  };

  const watchDefaultHljsTheme = (callback: (theme: string, oldTheme: string) => void) => {
    store.onDidChange('defaultHljsTheme', (newValue, oldValue) => {
      callback(newValue as string, oldValue as string);
    });
  };

  return {
    setThemeList,
    getThemeList,
    addTheme,
    removeTheme,
    updateTheme,
    watchThemeList,
    setDefaultThemeId,
    getDefaultThemeId,
    watchDefaultThemeId,
    setDefaultHljsTheme,
    getDefaultHljsTheme,
    watchDefaultHljsTheme,
  };
};

export default themes;
