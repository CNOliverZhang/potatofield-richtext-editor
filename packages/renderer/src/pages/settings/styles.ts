import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',

    '& .tabs': {
      width: 180,
      flexShrink: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.palette.background.default,
      '-webkit-app-region': 'drag',

      '& .tab': {
        width: '100%',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.2s',
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.background.default,
        cursor: 'pointer',
        userSelect: 'none',
        '-webkit-app-region': 'no-drag',

        '&.active': {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.primary.main,
        },
      },
    },

    '& .content': {
      flexGrow: 1,
    },
  },
});
