import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileLines as ArticleIcon,
  faBrush as StyleIcon,
  faSliders as SettingsIcon,
} from '@fortawesome/free-solid-svg-icons';
import { IconButton, useTheme } from '@mui/material';

import { openWindow } from '@/utils/window';
import Storage from '@/store';
import styles from './styles';
import ArticleList from './list';

const Articles: React.FC = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const storage = Storage();
  const [articleList, setArticleList] = useState(storage.articles.getArticleList());
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  storage.articles.watchArticleList((articles) => setArticleList(articles));

  const onListSelect = (article: Article) => {
    setSelectedArticle(article);
  };

  return (
    <div className={classes.articles}>
      <ArticleList articleList={articleList} onSelect={onListSelect} />
    </div>
  );
};

export default Articles;
