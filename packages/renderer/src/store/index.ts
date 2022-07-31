import Store from 'electron-store';

import getSettings from './settings';
import getArticles from './articles';
import getThemes from './themes';
import getUserInfo from './user-info';

const store = new Store({ watch: true });

const storage = () => {
  const settings = getSettings(store);
  const articles = getArticles(store);
  const themes = getThemes(store);
  const userInfo = getUserInfo(store);

  return {
    settings,
    articles,
    themes,
    userInfo,
  };
};

export default storage;
