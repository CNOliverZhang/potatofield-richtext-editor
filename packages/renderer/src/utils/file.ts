import { ipcRenderer } from 'electron';

export const selectFile = (args?: SelectFileProps) => {
  return ipcRenderer.sendSync('selectFile');
};

export const selectDirectory = () => {
  return ipcRenderer.sendSync('selectDirectory');
};
