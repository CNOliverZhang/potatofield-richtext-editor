import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  articles: {
    display: 'flex',
    width: '100%',
    height: '100%',

    '& .article-list': {
      width: 300,
      height: 100,

      '&-header': {
        display: 'flex',
        padding: theme.spacing(2),
        alignItems: 'center',

        '& .search': {
          marginRight: theme.spacing(1),
          flexGrow: 1,
        },

        '& .add-button': {
          width: 40,
          height: 40,
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.default,
        },
      },
    },
  },
});
