import Store from 'electron-store';

import getSettings from './settings';
import getArticles from './articles';
import getThemes from './themes';

const store = new Store({ watch: true });

const storage = () => {
  const settings = getSettings(store);
  const articles = getArticles(store);
  const themes = getThemes(store);

  return {
    settings,
    articles,
    themes,
  };
};

export default storage;
