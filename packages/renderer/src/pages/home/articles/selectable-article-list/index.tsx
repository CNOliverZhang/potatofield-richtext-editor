import React from 'react';
import { createUseStyles } from 'react-jss';
import { Typography, useTheme } from '@mui/material';

import moment from 'moment';
import styles from './styles';

interface SelectableArticleListProps {
  articleList: Article[];
  onSelect: (article: Article) => void;
  selectedArticle: Article | null;
}

const SelectableArticleList: React.FC<SelectableArticleListProps> = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const { articleList, onSelect, selectedArticle } = props;
  const now = new Date();

  return (
    <div className={classes.selectableArticleList}>
      {(articleList || [])
        .sort((a, b) => Number(b.updateTime) - Number(a.updateTime))
        .map((item) => (
          <div
            key={item.id}
            className={`article ${selectedArticle?.id === item.id ? 'selected' : ''}`}
            onClick={() => onSelect(item)}
          >
            <Typography variant="body1" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body2" className="article-intro">
              {item.content}
            </Typography>
            <Typography variant="body2" color="textSecondary" className="article-time">
              {moment(item.updateTime).format(
                moment(item.updateTime).isSame(now, 'day') ? '今天 HH:mm' : 'YYYY 年 MM 月 DD 日',
              )}
            </Typography>
          </div>
        ))}
    </div>
  );
};

export default SelectableArticleList;
