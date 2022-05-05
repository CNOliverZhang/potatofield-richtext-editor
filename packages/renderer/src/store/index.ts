import Store from 'electron-store';

import getSettings from './settings';
import getArticles from './articles';

const storage = () => {
  const store = new Store({ watch: true });
  const settings = getSettings(store);
  const articles = getArticles(store);

  return {
    settings,
    articles,
  };
};

export default storage;
