import { app, BrowserWindow } from 'electron';
import { release } from 'os';
import ElectronStore from 'electron-store';

import { openWindow } from './window';
import './ipc-listener';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) {
  app.disableHardwareAcceleration();
}

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {
  app.setAppUserModelId(app.getName());
}

if (!app.requestSingleInstanceLock()) {
  app.exit();
  process.exit(0);
}

ElectronStore.initRenderer();

let mainWindow: BrowserWindow | null;

app.whenReady().then(() => {
  mainWindow = openWindow({ title: '洋芋田富文本编辑器', path: '/' });
});

app.on('window-all-closed', () => {
  mainWindow = null;
  if (process.platform !== 'darwin') app.exit();
});

app.on('second-instance', () => {
  if (mainWindow?.isMinimized()) {
    mainWindow.restore();
  }
  mainWindow?.focus();
});

app.on('activate', () => {
  openWindow({ title: '洋芋田富文本编辑器', path: '/' });
});
