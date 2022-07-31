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
        margin: '30px auto',
        position: 'relative',
        cursor: 'pointer',
        '-webkit-app-region': 'no-drag',

        '&-img': {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        },

        '&-button': {
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: '0.3s',

          '&:hover': {
            opacity: 1,
          },

          '&-text': {
            marginTop: theme.spacing(0.5),
            lineHeight: '1em',
          },
        },
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
