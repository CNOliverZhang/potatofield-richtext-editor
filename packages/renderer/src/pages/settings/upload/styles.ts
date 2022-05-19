import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),

    '& .input': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },
});
