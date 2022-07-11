import React from 'react';
import { createUseStyles } from 'react-jss';
import { Typography, FormControlLabel, Switch, useTheme } from '@mui/material';

import useThemeContext from '@/contexts/theme';
import styles from './styles';

const CustomSettings: React.FC = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const { setDarkMode, darkMode } = useThemeContext();

  return (
    <div className={classes.container}>
      <Typography variant="h6" gutterBottom>
        界面设置
      </Typography>
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={(e, checked) => setDarkMode(checked)} />}
        label="深色模式"
      />
    </div>
  );
};

export default CustomSettings;
