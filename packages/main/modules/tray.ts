import { App, Menu, nativeImage, Tray } from 'electron';
import path from 'path';

import { openMainWindow, openWindow } from './window';

let tray: Tray;

export const initTray = (app: App) => {
  const icon = nativeImage.createFromPath(
    path.join(
      __dirname,
      `${app.isPackaged ? '../renderer' : '../../packages/renderer/public'}/tray/${
        process.platform === 'darwin' ? 'mac/iconTemplate.png' : 'windows/icon.ico'
      }`,
    ),
  );
  const menu = Menu.buildFromTemplate([
    {
      label: '打开主窗口',
      click: () => openMainWindow(),
    },
    {
      label: '设置',
      click: () =>
        openWindow({
          title: '设置',
          path: '/settings',
          width: 600,
          height: 400,
          resizable: false,
        }),
    },
    {
      label: '新建文章',
      click: () =>
        openWindow({
          title: '编辑器',
          path: '/editor',
          width: 1200,
          height: 800,
        }),
    },
    {
      label: '新建主题',
      click: () =>
        openWindow({
          title: '主题编辑器',
          path: '/theme-editor',
          width: 1200,
          height: 800,
        }),
    },
    {
      label: '退出',
      click: () => {
        app.exit();
        process.exit(0);
      },
    },
  ]);
  tray = new Tray(icon);
  tray.setContextMenu(menu);
  tray.setToolTip('洋芋田富文本编辑器');
  tray.on('double-click', () => openMainWindow());
};
