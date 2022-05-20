import axios from 'axios';

import Dialog from '@/imperative-components/dialog';
import Storage from '@/store';
import { UPLOAD_API } from '@/apis';

const storage = Storage();

interface UploadTarget {
  name: string;
  fields: string[];
  upload: (file: File) => Promise<string>;
}

const tucang = {
  name: '图仓',
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

export default { tucang } as Record<string, UploadTarget>;
