import React from 'react';
import { Typography, useTheme } from '@mui/material';
import { FolderOpen as EmptyIcon } from '@mui/icons-material';

import styles from './styles';

interface EmptyProps {
  description?: string;
}

const empty: React.FC<EmptyProps> = (props) => {
  const { description } = props;
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <div className={classes.root}>
      <EmptyIcon className="icon" />
      {description && (
        <Typography variant="body1" color="textSecondary" className="description">
          {description}
        </Typography>
      )}
    </div>
  );
};

export default empty;
