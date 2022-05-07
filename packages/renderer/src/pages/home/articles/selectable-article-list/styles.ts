import { alpha, Theme } from '@mui/material';

export default (theme: Theme) => ({
  selectableArticleList: {
    height: 0,
    flexGrow: 1,
    paddingTop: 0,
    padding: theme.spacing(2),
    overflowY: 'auto',

    '&.empty': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '-webkit-app-region': 'drag',
    },

    '&::-webkit-scrollbar': {
      display: 'none',
    },

    '& .article': {
      height: 90,
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',

      '&.selected': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },

      '&:not(.selected):hover': {
        backgroundColor: theme.palette.background.default,
      },

      '&-title': {
        display: 'flex',
        alignItems: 'center',

        '&-text': {
          flexGrow: 1,
        },

        '&-action': {
          marginLeft: theme.spacing(1),
          color: theme.palette.text.secondary,
          transition: '0.2s',

          '&:hover': {
            color: theme.palette.primary.main,
          },

          '&.delete:hover': {
            color: theme.palette.error.main,
          },
        },
      },

      '&-intro': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flexGrow: 1,
      },

      '&-time': {
        textAlign: 'right',
      },
    },
  },
});
