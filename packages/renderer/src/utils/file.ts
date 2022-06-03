import { ipcRenderer } from 'electron';

export const selectFile = (args?: SelectFileProps) => {
  return ipcRenderer.sendSync('select-file');
};

export const selectDirectory = () => {
  return ipcRenderer.sendSync('select-directory');
};
