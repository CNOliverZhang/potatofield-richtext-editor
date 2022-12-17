import { App, BrowserWindow, dialog, ipcMain } from 'electron';
import { checkForUpdate, installUpdate, startUpdate } from './update';
import { changeUrlParams, CreateWindowProps, openWindow } from './window';

interface SaveAsPdfParams {
  html: string;
  pageSize?: {
    width: number;
    height: number;
  };
}

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

  ipcMain.on('exit', () => {
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

  ipcMain.on('save-as-pdf', (event, args: SaveAsPdfParams) => {
    const win = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        contextIsolation: false,
        devTools: true,
      },
      show: false,
      width: args.pageSize?.width || 600,
      height: args.pageSize?.height || 800,
      fullscreenable: false,
      minimizable: false
    });
    win.loadURL(`data:text/html;charset=utf-8,${encodeURI(args.html)}`);
    win.webContents.on('did-finish-load', () => {
      win.webContents.printToPDF({
        pageSize: args.pageSize,
        printBackground: true,
      }).then((value) => {
        event.sender.send('pdf-generated', value);
      }).catch(() => {
        event.sender.send('pdf-generate-failed');
      }).finally(() => win.destroy());
    });
  })
};
