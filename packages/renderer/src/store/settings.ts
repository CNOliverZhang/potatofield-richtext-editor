import Store from 'electron-store';

const settings = (store: Store) => {
  const setDarkMode = (darkMode: boolean) => {
    store.set('darkMode', darkMode);
  };

  const getDarkMode = () => {
    return store.get('darkMode') as boolean;
  };

  const watchDarkMode = (callback: (darkMode: boolean, oldDarkMode: boolean) => void) => {
    store.onDidChange('darkMode', (newValue, oldValue) => {
      callback(newValue as boolean, oldValue as boolean);
    });
  };

  const setUploadTarget = (target: string) => {
    store.set('uploadTarget', target);
  };

  const getUploadTarget = () => {
    return store.get('uploadTarget') as string;
  };

  const watchUploadTarget = (callback: (target: string, oldTarget: string) => void) => {
    store.onDidChange('uploadTarget', (newValue, oldValue) => {
      callback(newValue as string, oldValue as string);
    });
  };

  const setUploadConfig = (target: string, config: Record<string, string>) => {
    store.set(`uploadConfig.${target}`, config);
  };

  const getUploadConfig = (target: string) => {
    return store.get(`uploadConfig.${target}`) as Record<string, string>;
  };

  const watchUploadConfig = (
    target: string,
    callback: (config: Record<string, string>, oldConfig: Record<string, string>) => void,
  ) => {
    store.onDidChange(`uploadConfig.${target}`, (newValue, oldValue) => {
      callback(newValue as Record<string, string>, oldValue as Record<string, string>);
    });
  };

  return {
    setDarkMode,
    getDarkMode,
    watchDarkMode,
    setUploadTarget,
    getUploadTarget,
    watchUploadTarget,
    setUploadConfig,
    getUploadConfig,
    watchUploadConfig,
  };
};

export default settings;
