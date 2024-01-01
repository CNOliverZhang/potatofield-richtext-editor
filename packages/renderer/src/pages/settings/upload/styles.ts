import { Theme } from '@mui/material';

export default (theme: Theme) => ({
  container: {
    height: '100%',
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 'var(--scroll-bar-width)',
      height: theme.spacing(2),
      backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.paper}, rgba(0, 0, 0, 0))`,
      zIndex: 10,
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 'var(--scroll-bar-width)',
      height: theme.spacing(2),
      backgroundImage: `linear-gradient(to top, ${theme.palette.background.paper}, rgba(0, 0, 0, 0))`,
      zIndex: 10,
    },

    '& .form': {
      height: '100%',
      padding: theme.spacing(2),
      overflow: 'auto',

      '& .input': {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        display: 'block',
      },

      '& .slider': {
        display: 'flex',
        alignItems: 'center',

        '&-inner': {
          flexGrow: 1,
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          marginLeft: theme.spacing(1),
          position: 'relative',
          display: 'flex',

          '& .MuiSlider-rail': {
            margin: 0,
          },
        },
      },
    },
  },
});
