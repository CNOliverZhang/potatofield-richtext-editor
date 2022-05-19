import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  themes: {
    display: 'flex',
    width: '100%',
    height: '100%',

    '& .theme-list': {
      width: 300,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',

      '&-tab': {
        width: '100%',
        height: 60,
        display: 'flex',

        '&-item': {
          width: 0,
          height: '100%',
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: '0.2s',
          cursor: 'pointer',
          userSelect: 'none',
          borderBottom: '4px solid transparent',

          '&.active': {
            borderBottomColor: theme.palette.primary.main,
          },
        },
      },

      '& .add-theme': {
        width: '100%',
        padding: theme.spacing(2),
        boxSizing: 'border-box',
      },

      '& .code-theme': {
        height: 0,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),

        '&-preview': {
          width: '100%',
          height: 0,
          flexGrow: 1,
          overflow: 'hidden',
          marginTop: theme.spacing(2),
          backgroundColor: theme.palette.background.default,
          borderRadius: theme.shape.borderRadius,

          '& pre': {
            margin: 0,
            width: '100%',
            height: '100%',
            padding: theme.spacing(2),
            overflow: 'auto',

            '&::-webkit-scrollbar': {
              width: 0,
            },
          },
        },
      },
    },

    '& .theme-preview': {
      width: 0,
      flexGrow: 1,
      borderLeft: `1px ${theme.palette.divider} solid`,
      display: 'flex',
      flexDirection: 'column',

      '&-title': {
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px ${theme.palette.divider} solid`,

        '&-text': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          '-webkit-line-clamp': 2,
          '-webkit-box-orient': 'vertical',
        },
      },

      '&-content': {
        height: 0,
        flexGrow: 1,
        overflowY: 'auto',

        '&-html': {
          padding: theme.spacing(2),
        },
      },

      '& .app-wrapper-padding': {
        paddingTop: 40,
      },

      '&.empty': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
      },
    },
  },
});
