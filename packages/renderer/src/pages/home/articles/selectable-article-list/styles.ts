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
    },

    '&::-webkit-scrollbar': {
      display: 'none',
    },

    '& .article': {
      borderRadius: theme.shape.borderRadius,
      padding: theme.spacing(1),

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
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },

        '&-action': {
          marginLeft: theme.spacing(1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          '&-inner': {
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
      },

      '&-update-time': {
        display: 'block',
      },

      '&-intro': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
  },
});
