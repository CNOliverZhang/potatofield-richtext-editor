import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useForm, Controller } from 'react-hook-form';
import {
  Typography,
  useTheme,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
  Slider,
} from '@mui/material';

import Upload from '@/utils/upload';
import Storage from '@/store';
import styles from './styles';

const UploadSettings: React.FC = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const form = useForm<Record<string, string>>();
  const [compress, setCompress] = useState(storage.settings.getUploadCompress() || false);
  const [compressQuality, setCompressQuality] = useState(
    storage.settings.getUploadCompressQuality() || 10,
  );
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

  useEffect(() => {
    storage.settings.setUploadCompress(compress);
  }, [compress]);

  useEffect(() => {
    storage.settings.setUploadCompressQuality(compressQuality);
  }, [compressQuality]);

  return (
    <div className={classes.container}>
      <div className="form">
        <Typography variant="h6" gutterBottom>
          上传目标
        </Typography>
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
        <Typography variant="h6" gutterBottom>
          上传配置
        </Typography>
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
        <Typography variant="h6" gutterBottom>
          图片压缩
        </Typography>
        <FormControlLabel
          control={
            <Switch checked={compress} onChange={(event) => setCompress(event.target.checked)} />
          }
          label="开启压缩"
        />
        <div className="slider">
          <Typography>压缩质量</Typography>
          <div className="slider-inner">
            <Slider
              valueLabelDisplay="auto"
              min={10}
              max={100}
              disabled={!compress}
              value={compressQuality}
              onChange={(event, value) => setCompressQuality(value as number)}
            />
          </div>
        </div>
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
    </div>
  );
};

export default UploadSettings;
