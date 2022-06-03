import { ipcRenderer } from 'electron';

export const changeUrlParams = (params: Record<string, string>) => {
  const paramString = Object.entries(params).reduce(
    (prev, cur, index) => `${prev}${index === 0 ? '?' : '&'}${cur[0]}=${cur[1]}`,
    '',
  );
  ipcRenderer.send('change-url-params', paramString);
  window.history.pushState({}, '', `${window.location.href.split('?')[0]}${paramString}`);
};
