import axios from 'axios';
import Cos from 'cos-nodejs-sdk-v5';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

import Storage from '@/store';
import { UPLOAD_API } from '@/apis';

const storage = Storage();

interface UploadTarget {
  name: string;
  tip?: string;
  fields: string[];
  upload: (file: File) => Promise<string>;
}

const tucang = {
  name: '图仓',
  tip: '使用图仓上传的图片可能无法被同步到微信公众号后台',
  fields: ['token'],
  upload: async (file: File) => {
    const config = storage.settings.getUploadConfig('tucang');
    if (!config?.token) {
      return Promise.reject(
        new Error('您尚未配置图仓 token，请您按照指引在设置页面进行操作，方可使用图仓上传。'),
      );
    }
    const formData = new FormData();
    formData.append('token', config.token);
    formData.append('file', file);
    try {
      const res = await axios.post(UPLOAD_API.TUCANG, formData);
      if (Number(res.data.code) === 200) {
        return Promise.resolve(res.data.data.url);
      }
      return Promise.reject(new Error('请您检查网络状况或 token 是否正确。'));
    } catch (err) {
      return Promise.reject(new Error('请您检查网络状况或 token 是否正确。'));
    }
  },
};

const tCloud = {
  name: '腾讯云 COS',
  fields: ['SecretId', 'SecretKey', 'Bucket', 'Region'],
  upload: async (file: File) => {
    return new Promise((resolve, reject) => {
      const config = storage.settings.getUploadConfig('tCloud');
      const { Bucket, Region, SecretId, SecretKey } = config || {};
      if (!Bucket || !Region || !SecretId || !SecretKey) {
        reject(
          new Error(
            '您尚未配置腾讯云 COS 配置，请您按照指引在设置页面进行操作，方可使用腾讯云 COS 上传。',
          ),
        );
      }
      try {
        const extension = file.path.split('.').pop();
        const cos = new Cos({ SecretId, SecretKey });
        cos.putObject(
          {
            Bucket,
            Region,
            Key: `${uuid()}.${extension}`,
            Body: fs.createReadStream(file.path),
          },
          (err, data) => {
            if (!err) {
              resolve(`https://${data.Location}`);
            } else {
              reject(new Error('请您检查网络状况或配置是否正确。'));
            }
          },
        );
      } catch (e) {
        reject(new Error('请您检查网络状况或配置是否正确。'));
      }
    });
  },
};

export default { tCloud, tucang } as Record<string, UploadTarget>;
