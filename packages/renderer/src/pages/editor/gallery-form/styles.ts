import { alpha, Theme } from '@mui/material';

export default (theme: Theme) => ({
  container: {
    '& .section-title': {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),

      '&:first-child': {
        marginTop: 0,
      },
    },

    '& .uploaded-list': {
      display: 'flex',
      flexWrap: 'wrap',
      minHeight: 50,
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      border: `1px ${theme.palette.primary.main} dashed`,
      background: alpha(theme.palette.primary.main, 0.15),
      padding: theme.spacing(0.5),

      '&-item': {
        width: 'calc(100% / 3)',
        height: 0,
        paddingBottom: 'calc(100% / 3)',
        position: 'relative',

        '&-img': {
          position: 'absolute',
          left: theme.spacing(0.5),
          right: theme.spacing(0.5),
          top: theme.spacing(0.5),
          bottom: theme.spacing(0.5),
          borderRadius: theme.shape.borderRadius,
          overflow: 'hidden',

          '& img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          },

          '&-delete': {
            cursor: 'pointer',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            background: alpha(theme.palette.error.main, 0.5),
            color: theme.palette.common.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: '0.2s',

            '&:hover': {
              opacity: 1,
            },
          },
        },
      },

      '&-empty': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },

    '& .image-url-input': {
      display: 'flex',

      '&-button': {
        marginLeft: theme.spacing(1),
      },
    },

    '& #image-upload-dragger': {
      display: 'none',
    },

    '& .image-upload-dragger': {
      width: '100%',
      height: 160,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.shape.borderRadius,
      border: `1px ${theme.palette.primary.main} dashed`,
      background: alpha(theme.palette.primary.main, 0.15),
      cursor: 'pointer',
      transition: '0.2s',
      color: theme.palette.primary.main,

      '&-icon': {
        marginBottom: theme.spacing(2),
      },

      '&:hover': {
        background: alpha(theme.palette.primary.main, 0.25),
      },
    },
  },
});
