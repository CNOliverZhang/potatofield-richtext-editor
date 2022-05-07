import React from 'react';
import moment from 'moment';
import { createUseStyles } from 'react-jss';
import { Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashCan as DeleteIcon,
  faFileEdit as EditIcon,
} from '@fortawesome/free-solid-svg-icons';

import Dialog from '@/imperative-components/dialog';
import Empty from '@/components/empty';
import Storage from '@/store';
import { openWindow } from '@/utils/window';
import styles from './styles';

interface SelectableArticleListProps {
  articleList: Article[];
  onSelect: (article: Article) => void;
  selectedArticle: Article | null;
}

const SelectableArticleList: React.FC<SelectableArticleListProps> = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const storage = Storage();
  const { articleList, onSelect, selectedArticle } = props;
  const now = new Date();

  const edit = (articleId: string) => {
    openWindow({
      title: '编辑器',
      path: `/editor?id=${articleId}`,
      width: 1200,
      height: 800,
    });
  };

  const remove = (articleId: string) => {
    new Dialog({
      title: '操作确认',
      content: '确定删除文章吗？',
      onConfirm: () => {
        storage.articles.removeArticle(articleId);
      },
    });
  };

  return (
    <div className={`${classes.selectableArticleList} ${articleList?.length ? '' : 'empty'}`}>
      {articleList?.length ? (
        articleList
          .sort((a, b) => Number(b.updateTime) - Number(a.updateTime))
          .map((item) => (
            <div
              key={item.id}
              className={`article ${selectedArticle?.id === item.id ? 'selected' : ''}`}
              onClick={() => onSelect(item)}
            >
              <div className="article-title">
                <Typography variant="body1" className="article-title-text">
                  {item.title}
                </Typography>
                <FontAwesomeIcon
                  icon={EditIcon}
                  size="sm"
                  className="article-title-action"
                  onClick={() => edit(item.id)}
                />
                <FontAwesomeIcon
                  icon={DeleteIcon}
                  size="sm"
                  className="article-title-action delete"
                  onClick={() => remove(item.id)}
                />
              </div>
              <Typography variant="caption" color="textSecondary">
                {moment(item.updateTime).format(
                  moment(item.updateTime).isSame(now, 'day') ? '今天 HH:mm' : 'YYYY 年 MM 月 DD 日',
                )}
              </Typography>
              <Typography variant="body2" className="article-intro">
                {item.content}
              </Typography>
            </div>
          ))
      ) : (
        <Empty description="尚无已保存的文章" />
      )}
    </div>
  );
};

export default SelectableArticleList;
