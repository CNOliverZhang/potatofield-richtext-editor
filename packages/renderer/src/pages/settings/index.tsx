import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useTheme } from '@mui/material';

import AppWrappper from '@/components/app-wrappper';
import Custom from './custom';
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
            界面个性化设置
          </div>
        </div>
        <div className="content">{currentTab === 'custom' && <Custom />}</div>
      </div>
    </AppWrappper>
  );
};

export default Settings;
