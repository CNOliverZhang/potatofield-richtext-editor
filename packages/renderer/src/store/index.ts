import Store from 'electron-store';

import getSettings from './settings';

const storage = () => {
  const store = new Store({ watch: true });
  const settings = getSettings(store);

  return {
    settings,
  };
};

export default storage;
