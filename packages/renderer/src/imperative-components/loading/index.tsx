import { Backdrop, CircularProgress } from '@mui/material';
import React, { useState, forwardRef, useImperativeHandle, RefObject } from 'react';
import ReactDOM from 'react-dom/client';

import { ThemeProvider } from '@/contexts/theme';

import makeStyles from './styles';

interface LoadingMethods {
  close(): void;
}

const LoadingComponent = forwardRef<LoadingMethods>((props, ref) => {
  const [open, setOpen] = useState(true);
  const classes = makeStyles();

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

  root: ReactDOM.Root;

  component: RefObject<LoadingMethods>;

  constructor() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.root = ReactDOM.createRoot(this.container);
    this.component = React.createRef();
    this.root.render(
      <ThemeProvider>
        <LoadingComponent ref={this.component} />
      </ThemeProvider>,
    );
    return this;
  }

  close(): void {
    this.component?.current?.close();
    setTimeout(() => {
      this.root?.unmount();
      if (document.body.contains(this.container)) {
        document.body.removeChild(this.container);
      }
    }, 1000);
  }
}

export default Loading;
