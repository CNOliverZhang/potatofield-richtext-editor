import { Theme, alpha } from '@mui/material';

export default (theme: Theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',

    '& .app-bar': {
      width: '100%',
      height: 32,
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      '-webkit-app-region': 'drag',

      '&.no-height': {
        position: 'absolute',
        top: 0,
      },

      '&-title': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },

      '&-button': {
        '-webkit-app-region': 'no-drag',
        position: 'relative',
      },

      '&.win': {
        flexDirection: 'row',
        justifyContent: 'flex-end',

        '& .app-bar-button': {
          width: 48,
          height: '100%',
          transition: '0.2s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: theme.palette.text.primary,
          fontSize: 16,
          position: 'relative',

          '&:hover': {
            backgroundColor: alpha(theme.palette.text.primary, 0.1),
          },

          '&.close:hover': {
            color: theme.palette.error.contrastText,
            backgroundColor: theme.palette.error.main,
          },
        },
      },

      '&.mac': {
        justifyContent: 'flex-start',
        flexDirection: 'row',

        '& .app-bar-button': {
          width: 14,
          height: 14,
          borderRadius: 8,
          marginLeft: 8,

          '&.minimize': {
            backgroundColor: theme.palette.warning.main,
          },

          '&.maximize': {
            backgroundColor: theme.palette.success.main,
          },

          '&.close': {
            backgroundColor: theme.palette.error.main,
          },
        },
      },
    },

    '& .app-content': {
      height: 0,
      flexGrow: 1,
      width: '100%',
    },
  },
});
