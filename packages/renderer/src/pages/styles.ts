import { Theme, alpha } from '@mui/material';
import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (theme: Theme): Classes =>
  createUseStyles({
    root: {
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })();
