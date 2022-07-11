import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  container: {
    height: '100%',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 'var(--scroll-bar-width)',
      height: theme.spacing(2),
      backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.paper}, rgba(0, 0, 0, 0))`,
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 'var(--scroll-bar-width)',
      height: theme.spacing(2),
      backgroundImage: `linear-gradient(to top, ${theme.palette.background.paper}, rgba(0, 0, 0, 0))`,
    },

    '& .update': {
      height: '100%',
      padding: theme.spacing(2),
      overflow: 'auto',

      '& .input': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        display: 'block',
      },

      '& .progress': {
        display: 'flex',
        alignItems: 'center',

        '&-bar': {
          flexGrow: 1,
          marginRight: theme.spacing(2),
        },
      },
    },
  },
});
