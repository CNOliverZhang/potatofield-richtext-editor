import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useTheme } from '@mui/material';

import AppWrappper from '@/components/app-wrappper';
import Custom from './custom';
import Upload from './upload';
import Update from './update';
import styles from './styles';

const Settings: React.FC = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const [currentTab, setCurrentTab] = useState('upload');

  return (
    <AppWrappper title="设置" disableResize>
      <div className={classes.container}>
        <div className="tabs">
          <div
            className={`tab ${currentTab === 'upload' ? 'active' : ''}`}
            onClick={() => setCurrentTab('upload')}
          >
            图片上传设置
          </div>
          <div
            className={`tab ${currentTab === 'custom' ? 'active' : ''}`}
            onClick={() => setCurrentTab('custom')}
          >
            个性化设置
          </div>
          <div
            className={`tab ${currentTab === 'update' ? 'active' : ''}`}
            onClick={() => setCurrentTab('update')}
          >
            版本更新
          </div>
        </div>
        <div className="content">
          {currentTab === 'upload' && <Upload />}
          {currentTab === 'custom' && <Custom />}
          {currentTab === 'update' && <Update />}
        </div>
      </div>
    </AppWrappper>
  );
};

export default Settings;
