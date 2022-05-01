import { app, BrowserWindow, ipcMain } from 'electron';
import { CreateWindowProps, openWindow } from './window';

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
