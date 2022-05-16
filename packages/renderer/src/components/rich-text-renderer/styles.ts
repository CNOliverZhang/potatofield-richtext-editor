import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),

    '& img': {
      maxWidth: '100%',
    },
  },
});
