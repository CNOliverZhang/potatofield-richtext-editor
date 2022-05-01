import { ipcRenderer } from 'electron';

export interface OpenWindowProps {
  title: string;
  path: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
}

export const openWindow = (props: OpenWindowProps) => {
  ipcRenderer.send('open', props);
};
