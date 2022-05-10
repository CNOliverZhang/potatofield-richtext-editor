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

      '& .vditor': {
        height: 0,
        flexGrow: 1,
        marginTop: theme.spacing(1),
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

          '&:not(:last-child)': {
            marginRight: theme.spacing(1),
          },
        },
      },
    },
  },
});
