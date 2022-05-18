import { alpha, Theme } from '@mui/material';

export default (theme: Theme) => ({
  selectableThemeList: {
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

    '& .theme': {
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

        '&-chosen-icon': {
          marginRight: theme.spacing(1),
          color: theme.palette.success.main,
        },

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

            '&.choose:hover': {
              color: theme.palette.success.main,
            },
          },
        },
      },

      '&-type': {
        display: 'flex',
        alignItems: 'center',

        '& svg': {
          marginRight: theme.spacing(0.5),
          color: theme.palette.text.secondary,
        },
      },

      '&-intro': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
  },
});
