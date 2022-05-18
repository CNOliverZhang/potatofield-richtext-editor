import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { changeUrlParams, CreateWindowProps, openWindow } from './window';

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
  BrowserWindow.fromWebContents(event.sender)?.destroy();
});

ipcMain.on('relaunch', () => {
  app.relaunch();
  app.exit();
});

ipcMain.on('open', (event, args: CreateWindowProps) => {
  openWindow(args);
});

ipcMain.on('selectFile', (event, args?: SelectFileProps) => {
  const properties: ('openFile' | 'multiSelections')[] = ['openFile'];
  if (args?.multiple) {
    properties.push('multiSelections');
  }
  event.returnValue = dialog.showOpenDialogSync({
    filters: args?.filters,
    properties,
  });
});

ipcMain.on('selectDirectory', (event) => {
  event.returnValue = dialog.showOpenDialogSync({
    properties: ['openDirectory'],
  });
});

ipcMain.on('changeUrlParams', (event, paramString) => {
  changeUrlParams(BrowserWindow.fromWebContents(event.sender) as BrowserWindow, paramString);
});
