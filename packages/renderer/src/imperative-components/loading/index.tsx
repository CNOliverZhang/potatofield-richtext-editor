import { Backdrop, CircularProgress } from '@mui/material';
import React, { useState, forwardRef, useImperativeHandle, RefObject } from 'react';
import ReactDOM from 'react-dom';

import { ThemeProvider } from '@/contexts/theme';

import styles from './styles';

interface LoadingMethods {
  close(): void;
}

const LoadingComponent = forwardRef<LoadingMethods>((props, ref) => {
  const [open, setOpen] = useState(true);
  const classes = styles();

  useImperativeHandle(ref, () => ({
    close: () => {
      setOpen(false);
    },
  }));

  return (
    <Backdrop className={classes.root} open={open}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
});

class Loading {
  container: HTMLDivElement;

  component: RefObject<LoadingMethods>;

  constructor() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.component = React.createRef();
    ReactDOM.render(
      <ThemeProvider>
        <LoadingComponent ref={this.component} />
      </ThemeProvider>,
      this.container,
    );
    return this;
  }

  close(): void {
    this.component?.current?.close();
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(this.container);
      if (document.body.contains(this.container)) {
        document.body.removeChild(this.container);
      }
    }, 1000);
  }
}

export default Loading;
