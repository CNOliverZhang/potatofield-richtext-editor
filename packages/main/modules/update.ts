import { WebContents } from 'electron';
import { autoUpdater, ProgressInfo, UpdateInfo } from 'electron-updater';

const updateStatus = {
  isUpdating: false,
};
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

export const checkForUpdate = (updateWindowWebContents: WebContents) => {
  autoUpdater.checkForUpdates();
  autoUpdater.once('update-available', (value: UpdateInfo) => {
    updateWindowWebContents.send('update-available', value);
  });
  autoUpdater.once('update-not-available', () => {
    updateWindowWebContents.send('update-not-available');
  });
  autoUpdater.once('error', () => {
    updateWindowWebContents.send('update-check-error');
  });
};

export const startUpdate = (updateWindowWebContents: WebContents) => {
  if (updateStatus.isUpdating) {
    updateWindowWebContents.send('updating');
  } else {
    updateStatus.isUpdating = true;
    autoUpdater.on('download-progress', (progress: ProgressInfo) => {
      updateWindowWebContents.send('update-download-progress', progress);
    });
    autoUpdater.once('update-downloaded', () => {
      updateWindowWebContents.send('update-downloaded');
    });
    autoUpdater.once('error', () => {
      updateStatus.isUpdating = false;
      updateWindowWebContents.send('update-download-error');
    });
    autoUpdater.downloadUpdate();
  }
};

export const installUpdate = () => {
  autoUpdater.quitAndInstall();
};
