import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMaximize as maximizeIcon } from '@fortawesome/free-regular-svg-icons';
import {
  faTimes as closeIcon,
  faWindowMinimize as minimizeIcon,
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@mui/material';

import styles from './styles';

interface AppWrapperProps {
  beforeClose?: () => Promise<never>;
  title?: string;
  noHeight?: boolean;
  disableResize?: boolean;
}

const App: React.FC<AppWrapperProps> = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const [isWindows] = useState(ipcRenderer.sendSync('platform') === 'win32');

  const handleIpcCommand = (command: string) => ipcRenderer.send(command);

  const handleClose = () => {
    if (props.beforeClose) {
      props.beforeClose().then(() => handleIpcCommand('close'));
    } else {
      handleIpcCommand('close');
    }
  };

  return (
    <div className={classes.root}>
      <div className={`app-bar ${isWindows ? 'win' : 'mac'} ${props.noHeight ? 'no-height' : ''}`}>
        {props.title && <div className="app-bar-title">{props.title}</div>}
        <div className="app-bar-button minimize" onClick={() => handleIpcCommand('minimize')}>
          {isWindows && <FontAwesomeIcon icon={minimizeIcon} />}
        </div>
        {!props.disableResize && (
          <div className="app-bar-button maximize" onClick={() => handleIpcCommand('maximize')}>
            {isWindows && <FontAwesomeIcon icon={maximizeIcon} />}
          </div>
        )}
        <div className="app-bar-button close" onClick={handleClose}>
          {isWindows && <FontAwesomeIcon icon={closeIcon} />}
        </div>
      </div>
      <div className="app-content">{props.children}</div>
    </div>
  );
};

export default App;
