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

  const setUploadCompress = (compress: boolean) => {
    store.set('uploadCompress.compress', compress);
  };

  const getUploadCompress = () => {
    return store.get('uploadCompress.compress') as boolean;
  };

  const watchUploadCompress = (callback: (config: boolean, oldConfig: boolean) => void) => {
    store.onDidChange('uploadCompress.compress', (newValue, oldValue) => {
      callback(newValue as boolean, oldValue as boolean);
    });
  };

  const setUploadCompressQuality = (compressQuality: number) => {
    store.set('uploadCompress.quality', compressQuality);
  };

  const getUploadCompressQuality = () => {
    return store.get('uploadCompress.quality') as number;
  };

  const watchUploadCompressQuality = (callback: (config: boolean, oldConfig: boolean) => void) => {
    store.onDidChange('uploadCompress.quality', (newValue, oldValue) => {
      callback(newValue as boolean, oldValue as boolean);
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
    setUploadCompress,
    getUploadCompress,
    watchUploadCompress,
    setUploadCompressQuality,
    getUploadCompressQuality,
    watchUploadCompressQuality,
  };
};

export default settings;
