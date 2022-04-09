import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (): Classes =>
  createUseStyles({
    root: {
      zIndex: 10000,
    },
  })();
