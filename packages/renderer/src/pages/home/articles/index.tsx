import React, { useEffect, useRef, useState } from 'react';
import Vditor from 'vditor';
import { createUseStyles } from 'react-jss';
import { ipcRenderer } from 'electron';
import { IconButton, TextField, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as AddIcon } from '@fortawesome/free-solid-svg-icons';

import Storage from '@/store';
import Empty from '@/components/empty';
import RichTextRenderer from '@/components/rich-text-renderer';
import { useDebounce } from '@/utils/tool';
import { openWindow } from '@/utils/window';
import { isWindows as getIsWindows } from '@/utils/platform';
import SelectableList from './selectable-article-list';
import styles from './styles';

const Articles: React.FC = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const storage = Storage();
  const [isWindows] = useState(getIsWindows());
  const [articleList, setArticleList] = useState(storage.articles.getArticleList());
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedArticleMarkdown, setSelectedArticleMarkdown] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const selectedArticleRef = useRef<Article | null>();

  storage.articles.watchArticleList((articles) => setArticleList(articles));

  storage.articles.watchArticleList((storageArticleList) => {
    if (!storageArticleList.find((article) => article.id === selectedArticleRef.current?.id)) {
      setSelectedArticle(null);
      setSelectedArticleMarkdown('');
    }
  });

  const debouncedSearch = useRef(
    useDebounce((value) => setSearchKeyword(value), 500, { leading: false }),
  );

  const onListSelect = (article: Article) => {
    setSelectedArticle(article);
    setSelectedArticleMarkdown(article.content);
  };

  const addArticle = () => {
    openWindow({ title: '编辑器', path: '/editor', width: 1200, height: 800 });
  };

  useEffect(() => {
    selectedArticleRef.current = selectedArticle;
  }, [selectedArticle]);

  useEffect(() => {
    debouncedSearch.current?.(keyword);
  }, [keyword]);

  return (
    <div className={classes.articles}>
      <div className="article-list">
        <div className="article-list-header">
          <TextField
            size="small"
            className="search"
            label="搜索标题"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <IconButton className="add-button">
            <FontAwesomeIcon icon={AddIcon} onClick={addArticle} />
          </IconButton>
        </div>
        <SelectableList
          articleList={articleList.filter((item) => item.title.includes(searchKeyword))}
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
          <div className="article-preview-content">
            {selectedArticleMarkdown && (
              <RichTextRenderer
                elementId="article-preview-content-inner"
                markdown={selectedArticleMarkdown}
              />
            )}
          </div>
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
