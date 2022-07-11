import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { UpdateInfo } from 'electron-updater';
import { Button, LinearProgress, Typography, useTheme } from '@mui/material';

import { checkForUpdate, installUpdate, startUpdate } from '@/utils/update';
import { getCurrentVersion } from '@/utils/tool';
import styles from './styles';

const UpdateSettings: React.FC = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const [currentVersion, setCurrentVersion] = useState('');
  const [updateString, setUpdateString] = useState('正在检查更新');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>();
  const [downloadProgress, setDownloadProgress] = useState<number>();
  const [downloadFinished, setDownloadFinished] = useState(false);

  useEffect(() => {
    checkForUpdate()
      .then((info) => {
        setUpdateInfo(info);
      })
      .catch((err: Error) => {
        setUpdateString(err.message);
      });
    setCurrentVersion(getCurrentVersion());
  }, []);

  const download = () => {
    setDownloadProgress(0);
    startUpdate({ onDownloadProgress: (info) => setDownloadProgress(0) })
      .then(() => setDownloadFinished(true))
      .catch((err: Error) => {
        setUpdateInfo(undefined);
        setDownloadProgress(undefined);
        setUpdateString(err.message);
      });
  };

  const install = () => {
    installUpdate();
  };

  return (
    <div className={classes.container}>
      <div className="update">
        <Typography variant="h6" gutterBottom>
          当前版本
        </Typography>
        <Typography variant="body1" gutterBottom>
          {currentVersion}
        </Typography>
        <Typography variant="h6" gutterBottom>
          版本更新
        </Typography>
        {!downloadProgress && !updateInfo && (
          <Typography variant="body1" gutterBottom>
            {updateString}
          </Typography>
        )}
        {downloadProgress === undefined && updateInfo?.releaseNotes && (
          <>
            {(updateInfo.releaseNotes as string).split('\n').map((item) => (
              <Typography key={item} variant="body2" color="textSecondary" gutterBottom>
                {item}
              </Typography>
            ))}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className="input"
              onClick={download}
            >
              下载更新
            </Button>
          </>
        )}
        {downloadProgress !== undefined && (
          <>
            <Typography variant="body1" gutterBottom>
              更新下载完成
            </Typography>
            <div className="progress input">
              <LinearProgress
                color={downloadFinished ? 'success' : 'primary'}
                value={downloadProgress}
                variant="determinate"
                className="progress-bar"
              />
              <Typography variant="body2" color="textSecondary" className="progress-text">
                {downloadProgress} %
              </Typography>
            </div>
            {downloadFinished && (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className="input"
                onClick={install}
              >
                安装并重启软件
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateSettings;
