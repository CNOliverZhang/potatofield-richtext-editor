import { WebContents } from 'electron';
import { autoUpdater, ProgressInfo, UpdateInfo } from 'electron-updater';

export const checkForUpdate = (updateWindowWebContents: WebContents) => {
  autoUpdater.autoDownload = false;
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 200);
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    updateWindowWebContents.send('update-available', info);
  });
  autoUpdater.on('update-not-available', () => {
    updateWindowWebContents.send('update-not-available');
  });
  autoUpdater.on('download-progress', (progress: ProgressInfo) => {
    updateWindowWebContents.send('update-download-progress', progress.percent);
  });
  autoUpdater.on('update-downloaded', () => {
    updateWindowWebContents.send('update-downloaded');
  });
  autoUpdater.on('error', () => {
    updateWindowWebContents.send('update-error');
  });
};
