import React from 'react';
import { createUseStyles } from 'react-jss';
import { Typography, FormControlLabel, Switch, useTheme } from '@mui/material';

import useThemeContext from '@/contexts/theme';
import styles from './styles';

interface ArticleListProps {
  articleList: Article[];
  onSelect: (article: Article) => void;
}

const ArticleList: React.FC<ArticleListProps> = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const { setDarkMode, darkMode } = useThemeContext();
  const { articleList, onSelect } = props;

  return (
    <div className={classes.articleList}>
      <div />
    </div>
  );
};

export default ArticleList;
