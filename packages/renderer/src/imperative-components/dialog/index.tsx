import {
  Button,
  Dialog as MaterialDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React, { useState, forwardRef, useImperativeHandle, RefObject, ReactElement } from 'react';
import ReactDOM from 'react-dom/client';

import { ThemeProvider } from '@/contexts/theme';

interface DialogProps {
  title?: string;
  content: string | ReactElement;
  scroll?: 'paper' | 'body';
  fullScreen?: boolean;
  showConfirm?: boolean;
  showCancel?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmButtonStyle?: 'contained' | 'outlined' | 'text';
  cancelButtonStyle?: 'contained' | 'outlined' | 'text';
  closeOnClick?: boolean;
  onConfirm?: () => unknown;
  onCancel?: () => unknown;
}

interface DialogComponentProps extends DialogProps {
  container?: HTMLDivElement;
  root?: ReactDOM.Root;
}

interface DialogMethods {
  close(): void;
}

const DialogComponent = forwardRef<DialogMethods, DialogComponentProps>(
  (props: DialogComponentProps, ref) => {
    const [open, setOpen] = useState(true);

    const {
      title,
      content,
      scroll = 'paper',
      fullScreen = false,
      showConfirm = true,
      showCancel = true,
      confirmText = '确定',
      cancelText = '取消',
      confirmButtonStyle = 'text',
      cancelButtonStyle = 'text',
      onConfirm: originalOnConfirm,
      onCancel: originalOnCancel,
      closeOnClick = true,
      container,
      root,
    } = props;

    useImperativeHandle(ref, () => ({
      close: () => {
        setOpen(false);
      },
    }));

    const onConfirm = () => {
      if (originalOnConfirm) {
        originalOnConfirm();
      }
      if (closeOnClick) {
        setOpen(false);
        setTimeout(() => {
          if (container) {
            root?.unmount();
            if (document.body.contains(container)) {
              document.body.removeChild(container);
            }
          }
        }, 1000);
      }
    };

    const onCancel = () => {
      if (originalOnCancel) {
        originalOnCancel();
      }
      if (closeOnClick) {
        setOpen(false);
        setTimeout(() => {
          if (container) {
            root?.unmount();
            if (document.body.contains(container)) {
              document.body.removeChild(container);
            }
          }
        }, 1000);
      }
    };

    return (
      <MaterialDialog open={open} scroll={scroll} fullScreen={fullScreen}>
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>
          {content instanceof String ? <DialogContentText>{content}</DialogContentText> : content}
        </DialogContent>
        <DialogActions>
          {showCancel && (
            <Button variant={cancelButtonStyle} onClick={onCancel} color="primary">
              {cancelText}
            </Button>
          )}
          {showConfirm && (
            <Button variant={confirmButtonStyle} onClick={onConfirm} color="primary">
              {confirmText}
            </Button>
          )}
        </DialogActions>
      </MaterialDialog>
    );
  },
);

class Dialog {
  container: HTMLDivElement;

  root: ReactDOM.Root;

  component: RefObject<DialogMethods>;

  constructor(props: DialogProps) {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.root = ReactDOM.createRoot(this.container);
    this.component = React.createRef();
    const componentProps = {
      ...props,
      container: this.container,
      root: this.root,
    };
    this.root.render(
      <ThemeProvider>
        <DialogComponent ref={this.component} {...componentProps} />
      </ThemeProvider>,
    );
    return this;
  }

  change(props: DialogProps): void {
    const componentProps = {
      ...props,
      container: this.container,
      root: this.root,
    };
    this.root.render(
      <ThemeProvider>
        <DialogComponent ref={this.component} {...componentProps} />
      </ThemeProvider>,
    );
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

export default Dialog;
