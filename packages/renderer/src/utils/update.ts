import { ipcRenderer } from 'electron';
import { ProgressInfo, UpdateInfo } from 'electron-updater';

export const checkForUpdate = () =>
  new Promise<UpdateInfo>((resolve, reject) => {
    ipcRenderer.send('check-for-update');
    ipcRenderer.once('update-available', (event, args: UpdateInfo) => resolve(args));
    ipcRenderer.once('update-not-available', () => reject(new Error('已经是最新版本')));
    ipcRenderer.once('update-check-error', () => reject(new Error('检查更新失败')));
  });

interface StartUpdateProps {
  onDownloadProgress: (info: ProgressInfo) => void;
}

export const startUpdate = (props: StartUpdateProps) =>
  new Promise<void>((resolve, reject) => {
    ipcRenderer.send('start-update');
    ipcRenderer.once('update-downloaded', () => resolve());
    ipcRenderer.once('update-download-error', () => reject(new Error('下载更新失败')));
    ipcRenderer.once('updating', () => reject(new Error('正在进行更新')));
    ipcRenderer.on('update-download-progress', (event, args: ProgressInfo) =>
      props.onDownloadProgress(args),
    );
  });

export const installUpdate = () => {
  ipcRenderer.send('install-update');
};
