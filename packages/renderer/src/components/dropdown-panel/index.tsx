import React, { ReactElement } from 'react';
import { Button, Popover } from '@mui/material';

interface DropdownPanelProps {
  buttonText?: string;
  buttonColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  buttonFullWith?: boolean;
  buttonSize?: 'large' | 'medium' | 'small';
  buttonVariant?: 'contained' | 'outlined' | 'text';
  dropdownElement?: ReactElement;
  buttonClassName?: string;
}

const dropdownPanel: React.FC<DropdownPanelProps> = (props) => {
  const [anchor, setAnchor] = React.useState<null | Element>(null);

  const {
    buttonText = '下拉选择',
    buttonColor = 'primary',
    buttonFullWith = false,
    buttonSize = 'medium',
    buttonVariant = 'text',
    dropdownElement,
    children,
  } = props;

  const open = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const close = () => {
    setAnchor(null);
  };

  return (
    <>
      {dropdownElement ? (
        React.cloneElement(dropdownElement, { onClick: open })
      ) : (
        <Button
          onClick={open}
          color={buttonColor}
          fullWidth={buttonFullWith}
          size={buttonSize}
          variant={buttonVariant}
        >
          {buttonText}
        </Button>
      )}
      <Popover keepMounted anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
        <div onMouseLeave={close}>{children}</div>
      </Popover>
    </>
  );
};

export default dropdownPanel;
