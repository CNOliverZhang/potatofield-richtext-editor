import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',

    '& .tabs': {
      width: 120,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.palette.background.default,
      '-webkit-app-region': 'drag',

      '& .app-bar-area': {
        height: 32,
        width: '100%',
        '-webkit-app-region': 'no-drag',
      },

      '& .app-icon': {
        width: 60,
        height: 60,
        display: 'block',
        margin: '30px auto',
      },

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

        '&-icon': {
          marginRight: theme.spacing(1),
        },
      },

      '&-space': {
        flexGrow: 1,
      },

      '& .settings': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 30,
        '-webkit-app-region': 'no-drag',

        '&-icon': {
          color: theme.palette.text.secondary,
        },
      },
    },

    '& .content': {
      flexGrow: 1,
    },
  },
});
