import axios from 'axios';

import Dialog from '@/imperative-components/dialog';
import Storage from '@/store';
import { UPLOAD_API } from '@/apis';

const storage = Storage();

const tucang = {
  fields: ['token'],
  upload: async (file: File) => {
    const config = storage.settings.getUploadConfig('tucang');
    if (config?.token) {
      const formData = new FormData();
      formData.append('token', config.token);
      formData.append('file', file);
      axios
        .post(UPLOAD_API.TUCANG, formData)
        .then((res) => {
          if (Number(res.data.code) === 200) {
            return Promise.resolve(res.data.data.url);
          }
          return Promise.reject();
        })
        .catch(() => {
          new Dialog({
            title: '上传失败',
            content: '请您检查网络状况或 token 是否正确',
            showCancel: false,
          });
          return Promise.reject();
        });
    }
    new Dialog({
      title: '上传失败',
      content: '您尚未配置图仓 token，请您按照指引在设置页面进行操作，方可使用图仓上传。',
      showCancel: false,
    });
    return Promise.reject();
  },
};

export default { tucang };
