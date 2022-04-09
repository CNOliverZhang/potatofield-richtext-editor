import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (): Classes =>
  createUseStyles({
    root: {
      verticalAlign: 'inherit',
    },
  })();
