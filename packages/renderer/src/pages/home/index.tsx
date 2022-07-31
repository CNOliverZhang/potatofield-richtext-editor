import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ipcRenderer } from 'electron';
import { ProgressInfo, UpdateInfo } from 'electron-updater';
import { createUseStyles } from 'react-jss';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileLines as ArticleIcon,
  faBrush as StyleIcon,
  faSliders as SettingsIcon,
} from '@fortawesome/free-solid-svg-icons';
import { IconButton, LinearProgress, Link, Typography, useTheme } from '@mui/material';

import Storage from '@/store';
import Logo from '@/assets/images/global/logo.png';
import AppWrappper from '@/components/app-wrappper';
import Dialog from '@/imperative-components/dialog';
import { SEND_USAGE_INFO } from '@/apis';
import { openWindow } from '@/utils/window';
import { checkForUpdate, installUpdate, startUpdate } from '@/utils/update';
import { isWindows as getIsWindows } from '@/utils/platform';
import styles from './styles';
import Articles from './articles';
import Themes from './themes';

const Home: React.FC = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const storage = Storage();
  const [currentTab, setCurrentTab] = useState('articles');
  const [isWindows] = useState(getIsWindows());

  const update = () => {
    checkForUpdate().then((info: UpdateInfo) => {
      const dialog: Dialog = new Dialog({
        title: '有新版本',
        content: (
          <>
            <Typography variant="body1" gutterBottom>
              版本 {info.version} 已发布，是否要下载更新？
            </Typography>
            {(info.releaseNotes as string).split('\n').map((note) => (
              <Typography key={note} variant="body2" color="textSecondary" gutterBottom>
                {note}
              </Typography>
            ))}
          </>
        ),
        closeOnClick: false,
        onConfirm: () => {
          dialog.change({
            title: '正在下载更新',
            content: <LinearProgress value={0} variant="determinate" />,
            showCancel: false,
            showConfirm: false,
          });
          startUpdate({
            onDownloadProgress: (progress: ProgressInfo) => {
              dialog.change({
                title: '正在下载更新',
                content: <LinearProgress value={progress.percent} variant="determinate" />,
                showCancel: false,
                showConfirm: false,
              });
            },
          })
            .then(() => {
              dialog.change({
                title: '已准备好安装更新',
                content: '更新下载完成，已准备好安装更新并重启本软件',
                showCancel: false,
                onConfirm: () => installUpdate(),
              });
            })
            .catch(() => {
              dialog.change({
                title: '下载更新失败',
                content: '更新下载失败，请您稍后重试',
                showCancel: false,
              });
            });
        },
        onCancel: () => dialog.close(),
      });
    });
  };

  const checkTermsAgreed = () => new Promise<void>((resolve, reject) => {
    const termsAgreed = storage.userInfo.getTermsAgreed()
    if (termsAgreed) {
      resolve();
    } else {
      new Dialog({
        title: '用户协议',
        content: <>
          您必须先阅读并同意我们的<Link href="https://potatofield.cn/richtexteditor/terms#eula" target="_blank" underline="none">《使用协议》</Link>
          和<Link href="https://potatofield.cn/richtexteditor/terms#privacy" target="_blank" underline="none">《隐私政策》</Link>才能使用本软件。
        </>,
        confirmText: '我已阅读并同意《使用协议》和《隐私政策》',
        onConfirm: () => {
          storage.userInfo.setTermsAgreed(true);
          resolve();
        },
        onCancel: () => {
          reject();
        },
      });
    }
  });

  const sendUsageInfo = () => {
    const version = ipcRenderer.sendSync('version');
    const platform = ipcRenderer.sendSync('platform');
    let identifier = storage.userInfo.getIdentifier();
    if (!identifier) {
      identifier = uuid();
      storage.userInfo.setIdentifier(identifier);
    }
    axios.post(SEND_USAGE_INFO, { version, platform, identifier });
  }

  useEffect(() => {
    checkTermsAgreed().then(() => {
      update();
      sendUsageInfo();
    }).catch(() => ipcRenderer.send('exit'));
  }, []);

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
        <div className="content">{currentTab === 'articles' ? <Articles /> : <Themes />}</div>
      </div>
    </AppWrappper>
  );
};

export default Home;
