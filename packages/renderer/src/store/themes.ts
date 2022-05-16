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

  const watchThemeList = (callback: (themeList: Theme[]) => void) => {
    store.onDidChange('themeList', (newValue, oldValue) => {
      callback(newValue as Theme[]);
    });
  };

  const setDefaultThemeId = (themeId: string) => {
    store.set('defaultThemeId', themeId);
  };

  const getDefaultThemeId = () => {
    return store.get('defaultThemeId') as string;
  };

  const watchDefaultThemeId = (callback: (themeId: string) => void) => {
    store.onDidChange('defaultThemeId', (newValue, oldValue) => {
      callback(newValue as string);
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
  };
};

export default themes;
