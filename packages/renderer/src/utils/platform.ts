import { ipcRenderer } from 'electron';

export const isWindows = () => {
  return ipcRenderer.sendSync('platform') === 'win32';
};

export const isMac = () => {
  return ipcRenderer.sendSync('platform') === 'darwin';
};
