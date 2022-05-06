import { alpha, Theme } from '@mui/material';

export default (theme: Theme) => ({
  selectableArticleList: {
    height: 0,
    flexGrow: 1,
    paddingTop: 0,
    padding: theme.spacing(2),
    overflowY: 'auto',

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
