import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',

    '& .editor': {
      width: 0,
      height: '100%',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(2),

      '&-line': {
        display: 'flex',
        marginBottom: theme.spacing(2),

        '&-input': {
          width: 0,
          flexGrow: 1,

          '&:not(:first-child)': {
            marginLeft: theme.spacing(1),
          },

          '&:not(:last-child)': {
            marginRight: theme.spacing(1),
          },
        },
      },

      '&-text-area': {
        width: '100%',
        height: 0,
        flexGrow: 1,

        '& .MuiOutlinedInput-root': {
          width: '100%',
          height: '100%',
          padding: 0,

          '& textarea': {
            width: '100%',
            height: '100%',
            overflow: 'auto',
            padding: theme.spacing(2),
            boxSizing: 'border-box',
          },
        },
      },

      '&.app-wrapper-padding': {
        paddingTop: 40,
      },
    },

    '& .preview': {
      width: 400,
      flexShrink: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.default,
      borderLeft: `1px ${theme.palette.divider} solid`,

      '&-controller': {
        padding: theme.spacing(2),
        borderBottom: `1px ${theme.palette.divider} solid`,

        '&.app-wrapper-padding': {
          paddingTop: 40,
        },
      },

      '&-title': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
      },

      '&-wrapper': {
        backgroundColor: theme.palette.background.paper,
        height: 0,
        flexGrow: 1,
        overflowY: 'auto',
        padding: theme.spacing(2),
      },

      '& .button-group': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        display: 'flex',

        '&:first-child': {
          marginTop: 0,
        },

        '&:last-child': {
          marginBottom: 0,
        },

        '& .action-button': {
          width: 0,
          flexGrow: 1,
          color: theme.palette.common.white,

          '&:not(:first-child)': {
            marginLeft: theme.spacing(1),
          },

          '&:not(:last-child)': {
            marginRight: theme.spacing(1),
          },
        },
      },
    },
  },
});
