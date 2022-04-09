import { Theme } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes =>
  createUseStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: theme.spacing(4),

      '& .icon': {
        fontSize: theme.typography.h1.fontSize,
        color: theme.palette.text.secondary,
      },

      '& .description': {
        marginTop: theme.spacing(1),
      },
    },
  })();
