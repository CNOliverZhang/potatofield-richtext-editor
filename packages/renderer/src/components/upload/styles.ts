import { Classes } from 'jss';
import { createUseStyles } from 'react-jss';

export default (): Classes =>
  createUseStyles({
    input: {
      display: 'none',
    },
  })();
