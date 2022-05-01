import Store from 'electron-store';

const settings = (store: Store) => {
  const setDarkMode = (darkMode: boolean) => {
    store.set('darkMode', darkMode);
  };

  const getDarkMode = () => {
    return store.get('darkMode') as boolean;
  };

  const watchDarkMode = (callback: (darkMode: boolean) => void) => {
    store.onDidChange('darkMode', (newValue, oldValue) => {
      callback(newValue as boolean);
    });
  };

  return {
    setDarkMode,
    getDarkMode,
    watchDarkMode,
  };
};

export default settings;
