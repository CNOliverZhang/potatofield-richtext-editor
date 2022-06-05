import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useForm, Controller } from 'react-hook-form';
import { Typography, useTheme, TextField, MenuItem, Button } from '@mui/material';

import Upload from '@/utils/upload';
import Storage from '@/store';
import styles from './styles';

const UploadSettings: React.FC = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const form = useForm<Record<string, string>>();
  const [uploadTarget, setUploadTarget] = useState(
    storage.settings.getUploadTarget() || Object.keys(Upload)[0],
  );

  const saveConfig = () => {
    storage.settings.setUploadConfig(uploadTarget, form.getValues());
    form.reset(form.getValues());
  };

  useEffect(() => {
    storage.settings.setUploadTarget(uploadTarget);
    const config = storage.settings.getUploadConfig(uploadTarget);
    if (config) {
      form.reset(config);
    }
  }, [uploadTarget]);

  return (
    <div className={classes.container}>
      <Typography>上传目标</Typography>
      <TextField
        label="上传目标"
        size="small"
        className="input"
        value={uploadTarget}
        onChange={(e) => setUploadTarget(e.target.value)}
        fullWidth
        select
      >
        {Object.keys(Upload).map((item) => (
          <MenuItem key={item} value={item}>
            {Upload[item].name}
          </MenuItem>
        ))}
      </TextField>
      <Typography>上传配置</Typography>
      {Upload[uploadTarget].fields.map((fieldName: string) => (
        <Controller
          key={fieldName}
          name={fieldName}
          defaultValue=""
          control={form.control}
          render={({ field }) => (
            <TextField
              label={fieldName}
              placeholder={`请输入${fieldName}`}
              className="input"
              size="small"
              fullWidth
              {...field}
            />
          )}
        />
      ))}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={saveConfig}
        disabled={
          !form.formState.isDirty ||
          !Upload[uploadTarget].fields.reduce(
            (prev: boolean, cur: string) => Boolean(form.watch(cur)) && prev,
            true,
          )
        }
      >
        {!form.formState.isDirty ? '配置已保存' : '保存配置'}
      </Button>
    </div>
  );
};

export default UploadSettings;
