import { ipcRenderer } from 'electron';
import sharp from 'sharp';
import path from 'path';
import { v4 as uuid } from 'uuid';

export const compressImage = (filepath: string, quality: number) =>
  new Promise<string>((resolve, reject) => {
    const tempName = path.join(ipcRenderer.sendSync('temp-path'), `${uuid()}.webp`);
    sharp(filepath)
      .rotate()
      .webp({ quality })
      .toFile(tempName)
      .then(() => {
        resolve(tempName);
      })
      .catch(() => {
        reject(new Error('压缩文件失败。'));
      });
  });
