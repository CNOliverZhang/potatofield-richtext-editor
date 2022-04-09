import useTheme from '@/contexts/theme';
import React from 'react';

import styles from './styles';

const index: React.FC = () => {
  const { theme } = useTheme();
  const classes = styles(theme);

  return <div className={classes.root}>Hello world</div>;
};

export default index;
