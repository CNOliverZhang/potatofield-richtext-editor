import { Snackbar, Alert } from '@mui/material';
import React, { useState, forwardRef, useImperativeHandle, RefObject } from 'react';
import ReactDOM from 'react-dom/client';

import { ThemeProvider } from '@/contexts/theme';

interface MessageProps {
  type?: 'error' | 'info' | 'success' | 'warning';
  content: string;
  duration?: number;
}

interface MessageComponentProps extends MessageProps {
  container?: HTMLDivElement;
  root?: ReactDOM.Root;
}

interface MessageMethods {
  close(): void;
}

const MessageComponent = forwardRef<MessageMethods, MessageComponentProps>(
  (props: MessageComponentProps, ref) => {
    const [open, setOpen] = useState(true);

    const { type, content, duration, container, root } = props;

    useImperativeHandle(ref, () => ({
      close: () => {
        setOpen(false);
      },
    }));

    const onClose = () => {
      setOpen(false);
      setTimeout(() => {
        if (container) {
          root?.unmount();
          if (document.body.contains(container)) {
            document.body.removeChild(container);
          }
        }
      }, 1000);
    };

    let autoHideDuration: number | undefined = 3000;
    if (duration === 0) {
      autoHideDuration = undefined;
    } else if (duration) {
      autoHideDuration = duration;
    }

    return (
      <Snackbar
        open={open}
        message={type ? undefined : content}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
      >
        {type ? (
          <Alert variant="filled" severity={type}>
            {content}
          </Alert>
        ) : undefined}
      </Snackbar>
    );
  },
);

class Message {
  container: HTMLDivElement;

  root: ReactDOM.Root;

  component: RefObject<MessageMethods>;

  constructor(props: MessageProps | string) {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.root = ReactDOM.createRoot(this.container);
    this.component = React.createRef();
    if (typeof props === 'string') {
      this.root.render(
        <ThemeProvider>
          <MessageComponent
            ref={this.component}
            content={props}
            container={this.container}
            root={this.root}
          />
        </ThemeProvider>,
      );
    } else {
      this.root.render(
        <ThemeProvider>
          <MessageComponent
            ref={this.component}
            container={this.container}
            root={this.root}
            {...props}
          />
        </ThemeProvider>,
      );
    }
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

export default Message;
