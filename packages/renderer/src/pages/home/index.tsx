import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { createUseStyles } from 'react-jss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileLines as ArticleIcon,
  faBrush as StyleIcon,
  faSliders as SettingsIcon,
} from '@fortawesome/free-solid-svg-icons';
import { IconButton, useTheme } from '@mui/material';

import Logo from '@/assets/images/global/logo.png';
import AppWrappper from '@/components/app-wrappper';
import { openWindow } from '@/utils/window';
import styles from './styles';
import Articles from './components/articles';

const Home: React.FC = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const [currentTab, setCurrentTab] = useState('articles');
  const [isWindows] = useState(ipcRenderer.sendSync('platform') === 'win32');

  return (
    <AppWrappper noHeight>
      <div className={classes.container}>
        <div className="tabs">
          {!isWindows && <div className="app-bar-area" />}
          <img src={Logo} className={`app-icon ${isWindows ? 'win' : 'mac'}`} />
          <div
            className={`tab ${currentTab === 'articles' ? 'active' : ''}`}
            onClick={() => setCurrentTab('articles')}
          >
            <FontAwesomeIcon icon={ArticleIcon} className="tab-icon" />
            文章
          </div>
          <div
            className={`tab ${currentTab === 'styles' ? 'active' : ''}`}
            onClick={() => setCurrentTab('styles')}
          >
            <FontAwesomeIcon icon={StyleIcon} className="tab-icon" />
            样式
          </div>
          <div className="tabs-space" />
          <div className="settings">
            <IconButton
              className="settings-icon"
              onClick={() =>
                openWindow({
                  title: '设置',
                  path: '/settings',
                  width: 600,
                  height: 400,
                  resizable: false,
                })
              }
            >
              <FontAwesomeIcon icon={SettingsIcon} />
            </IconButton>
          </div>
        </div>
        <div className="content">{currentTab === 'articles' && <Articles />}</div>
      </div>
    </AppWrappper>
  );
};

export default Home;
