import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { IconButton, TextField, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as AddIcon } from '@fortawesome/free-solid-svg-icons';

import Storage from '@/store';
import SelectableList from '@/components/selectable-list';
import { openWindow } from '@/utils/window';
import styles from './styles';

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

  const addArticle = () => {
    openWindow({ title: '编辑器', path: '/editor', width: 1200, height: 800 });
  };

  return (
    <div className={classes.articles}>
      <div className="article-list">
        <div className="article-list-header">
          <TextField size="small" className="search" label="搜索标题" />
          <IconButton className="add-button">
            <FontAwesomeIcon icon={AddIcon} onClick={addArticle} />
          </IconButton>
        </div>
        <SelectableList
          itemList={articleList}
          onSelect={onListSelect}
          selectedItem={selectedArticle}
        />
      </div>
    </div>
  );
};

export default Articles;
