import { ipcRenderer } from 'electron';
import { ProgressInfo, UpdateInfo } from 'electron-updater';

export const checkForUpdate = (props: {
  onUpdateAvailable: (info: UpdateInfo) => void;
  onDownloadProgress: (progress: ProgressInfo) => void;
  onUpdateDownloaded: () => void;
}) => {
  ipcRenderer.send('check-for-update');
  ipcRenderer.once('update-available', (event, args) => props.onUpdateAvailable(args));
  ipcRenderer.on('update-download-progress', (event, args) => props.onDownloadProgress(args));
  ipcRenderer.once('update-downloaded', props.onUpdateDownloaded);
};
