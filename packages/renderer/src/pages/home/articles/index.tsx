import React, { useEffect, useRef, useState } from 'react';
import Vditor from 'vditor';
import { createUseStyles } from 'react-jss';
import { ipcRenderer } from 'electron';
import { IconButton, TextField, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as AddIcon } from '@fortawesome/free-solid-svg-icons';

import Storage from '@/store';
import Empty from '@/components/empty';
import { openWindow } from '@/utils/window';
import SelectableList from './selectable-article-list';
import styles from './styles';

const Articles: React.FC = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const storage = Storage();
  const [isWindows] = useState(ipcRenderer.sendSync('platform') === 'win32');
  const [articleList, setArticleList] = useState(storage.articles.getArticleList());
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedArticleHtml, setSelectedArticleHtml] = useState('');
  const selectedArticleRef = useRef<Article | null>();

  storage.articles.watchArticleList((articles) => setArticleList(articles));

  storage.articles.watchArticleList((storageArticleList) => {
    if (!storageArticleList.find((article) => article.id === selectedArticleRef.current?.id)) {
      setSelectedArticle(null);
      setSelectedArticleHtml('');
    }
  });

  const onListSelect = (article: Article) => {
    setSelectedArticle(article);
    Vditor.md2html(article.content).then((html) => setSelectedArticleHtml(html));
  };

  const addArticle = () => {
    openWindow({ title: '编辑器', path: '/editor', width: 1200, height: 800 });
  };

  useEffect(() => {
    selectedArticleRef.current = selectedArticle;
  }, [selectedArticle]);

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
          articleList={articleList}
          onSelect={onListSelect}
          selectedArticle={selectedArticle}
        />
      </div>
      {selectedArticle ? (
        <div className="article-preview">
          <div className={`article-preview-title ${isWindows ? 'app-wrapper-padding' : ''}`}>
            <Typography variant="h4" className="article-preview-title-text">
              {selectedArticle?.title}
            </Typography>
          </div>
          {selectedArticleHtml && (
            <div
              className="article-preview-content"
              dangerouslySetInnerHTML={{ __html: selectedArticleHtml }}
            />
          )}
        </div>
      ) : (
        <div className="article-preview empty">
          <Empty description="尚未选择" />
        </div>
      )}
    </div>
  );
};

export default Articles;
