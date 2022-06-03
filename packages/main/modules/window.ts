import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import storage from '../../renderer/src/store';

let mainWindow: BrowserWindow | null;

const DEFAULT_WINDOW_WIDTH = 900;
const DEFAULT_WINDOW_HEIGHT = 600;

const BG_COLOR = '#f5f5f5';
const DARK_MODE_BG_COLOR = '#1d1d1d';

interface WindowInfo {
  window: BrowserWindow;
  path: string;
}

const windowList: WindowInfo[] = [];

export interface CreateWindowProps {
  title: string;
  path: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
}

export const createWindow = (props: CreateWindowProps) => {
  const {
    title,
    path,
    width = DEFAULT_WINDOW_WIDTH,
    height = DEFAULT_WINDOW_HEIGHT,
    resizable = true,
  } = props;
  // electron 默认的不可缩放窗口样式不美观，使用 min 尺寸和 max 尺寸以及 maximizable 手动限制缩放
  const minWidth = resizable ? props.minWidth : width;
  const minHeight = resizable ? props.minHeight : height;
  const maxWidth = resizable ? undefined : width;
  const maxHeight = resizable ? undefined : height;
  const maximizable = resizable;
  const backgroundColor = storage().settings.getDarkMode() ? DARK_MODE_BG_COLOR : BG_COLOR;
  const window = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      devTools: !app.isPackaged,
    },
    frame: false,
    closable: false,
    resizable: true,
    width,
    height,
    title,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    maximizable,
    backgroundColor,
  });
  if (app.isPackaged) {
    window.loadURL(`file://${join(__dirname, '../renderer/index.html#') + path}`);
    window.webContents.closeDevTools();
  } else {
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}#`;
    window.loadURL(url + path);
    window.webContents.openDevTools({ mode: 'detach' });
  }
  windowList.push({ window, path: props.path });
  window.on('system-context-menu', (e: Event) => {
    e.preventDefault();
  });
  // 关闭窗口后，从窗口列表移除
  window.on('closed', () => {
    const windowIndex = windowList.findIndex((win) => win.path === props.path);
    windowList.splice(windowIndex, 1);
  });
  // 窗口最小化之后再取消最小化，尺寸会变，手动调整回正常尺寸
  window.on('restore', () => {
    window.setSize(props.width || DEFAULT_WINDOW_WIDTH, props.height || DEFAULT_WINDOW_HEIGHT);
  });
  // 窗口最大化之后再取消最大化，尺寸会变，手动调整回正常尺寸
  window.on('unmaximize', () => {
    window.setSize(props.width || DEFAULT_WINDOW_WIDTH, props.height || DEFAULT_WINDOW_HEIGHT);
  });
  return window;
};

// 如果窗口已存在，直接打开；否则创建窗口
export const openWindow = (props: CreateWindowProps) => {
  const windowInfo = windowList.find((win) => win.path === props.path);
  if (windowInfo) {
    windowInfo.window.show();
    return windowInfo.window;
  }
  return createWindow(props);
};

// 打开主窗口
export const openMainWindow = () => {
  mainWindow = openWindow({
    title: '洋芋田富文本编辑器',
    path: '/',
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  return mainWindow;
};

// 修改已打开的窗口的 URL 参数
export const changeUrlParams = (browserWindow: BrowserWindow, paramString: string) => {
  const window = windowList.find((item) => item.window.id === browserWindow.id);
  if (window) {
    window.path = `${window.path.split('?')[0]}${paramString}`;
  }
};
