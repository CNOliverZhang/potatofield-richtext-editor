import { App, BrowserWindow, dialog, ipcMain } from 'electron';
import { checkForUpdate, installUpdate, startUpdate } from './update';
import { changeUrlParams, CreateWindowProps, openWindow } from './window';

export const initIpcListeners = (app: App) => {
  ipcMain.on('platform', (event) => {
    event.returnValue = process.platform;
  });

  ipcMain.on('minimize', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
  });

  ipcMain.on('maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window?.isMaximized()) {
      window.unmaximize();
    } else {
      window?.maximize();
    }
  });

  ipcMain.on('close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.close();
  });

  ipcMain.on('relaunch', () => {
    app.relaunch();
    app.exit();
  });

  ipcMain.on('open', (event, args: CreateWindowProps) => {
    openWindow(args);
  });

  ipcMain.on('select-file', (event, args?: SelectFileProps) => {
    const properties: ('openFile' | 'multiSelections')[] = ['openFile'];
    if (args?.multiple) {
      properties.push('multiSelections');
    }
    event.returnValue = dialog.showOpenDialogSync({
      filters: args?.filters,
      properties,
    });
  });

  ipcMain.on('select-directory', (event) => {
    event.returnValue =
      dialog.showOpenDialogSync({
        properties: ['openDirectory'],
      })?.[0] || '';
  });

  ipcMain.on('change-url-params', (event, paramString) => {
    changeUrlParams(BrowserWindow.fromWebContents(event.sender) as BrowserWindow, paramString);
  });

  ipcMain.on('check-for-update', (event) => {
    checkForUpdate(event.sender);
  });

  ipcMain.on('start-update', (event) => {
    startUpdate(event.sender);
  });

  ipcMain.on('install-update', () => {
    installUpdate();
  });

  ipcMain.on('version', (event) => {
    event.returnValue = app.getVersion();
  });
};
