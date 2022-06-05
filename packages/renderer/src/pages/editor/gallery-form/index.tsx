import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { UseFormReturn } from 'react-hook-form';
import { Button, TextField, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan as DeleteIcon, faCopy as CopyIcon } from '@fortawesome/free-solid-svg-icons';

import Storage from '@/store';
import styles from './styles';

interface GalleryFormProps {
  galleryForm: UseFormReturn<Gallery>;
}

const GalleryForm: React.FC<GalleryFormProps> = (props: GalleryFormProps) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const [url, setUrl] = useState('');

  const addUrl = () => {
    props.galleryForm.setValue('imageList', [
      ...(props.galleryForm.getValues().imageList || []),
      url,
    ]);
    setUrl('');
  };

  const removeUrl = (index: number) => {
    const newUrlList = [...props.galleryForm.getValues().imageList];
    newUrlList.splice(index, 1);
    props.galleryForm.setValue('imageList', newUrlList);
  };

  return (
    <div className={classes.container}>
      <Typography variant="subtitle1" className="section-title" gutterBottom>
        已添加的图片
      </Typography>
      <div className="uploaded-list">
        {props.galleryForm.watch('imageList')?.length ? (
          props.galleryForm.watch('imageList').map((image, index) => (
            <div className="uploaded-list-item" key={image}>
              <div className="uploaded-list-item-img">
                <img src={image} />
                <div className="uploaded-list-item-img-delete" onClick={() => removeUrl(index)}>
                  删除
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="uploaded-list-empty">暂未选择</div>
        )}
      </div>
      <Typography variant="subtitle1" className="section-title" gutterBottom>
        输入图片 URL
      </Typography>
      <div className="image-url-input">
        <TextField value={url} onChange={(e) => setUrl(e.target.value)} size="small" label="URL" />
        <Button
          disabled={!url}
          variant="contained"
          color="primary"
          size="small"
          className="image-url-input-button"
          onClick={addUrl}
        >
          添加
        </Button>
      </div>
      <Typography variant="subtitle1" className="section-title" gutterBottom>
        拖拽上传
      </Typography>
      <div className="image-upload-dragger">拖拽文件到此区域</div>
    </div>
  );
};

export default GalleryForm;
