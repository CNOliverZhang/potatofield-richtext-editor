import { app } from 'electron';
import { release } from 'os';
import ElectronStore from 'electron-store';

import { openMainWindow } from './modules/window';
import { initIpcListeners } from './modules/ipc-listener';
import { initTray } from './modules/tray';

// Windows 7 阻止硬件加速
if (release().startsWith('6.1')) {
  app.disableHardwareAcceleration();
}

// Windows 10 以上的系统通知标题
if (process.platform === 'win32') {
  app.setAppUserModelId(app.getName());
}

// 用户开启的第二个实例自动退出
if (!app.requestSingleInstanceLock()) {
  app.exit();
  process.exit(0);
}

// 初始化存储
ElectronStore.initRenderer();

// 应用准备完成后开启主窗口
app.whenReady().then(() => {
  openMainWindow();
  // 初始化 ipc 监听
  initIpcListeners(app);
  // 初始化托盘
  initTray(app);
});

// 用户尝试开启第二个实例，打开主窗口
app.on('second-instance', () => {
  openMainWindow();
});

// 窗口全部关闭时阻止退出
app.on('window-all-closed', (e: Event) => {
  e.preventDefault();
});
