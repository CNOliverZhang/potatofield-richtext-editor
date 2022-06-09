import React, { ChangeEvent, DragEventHandler, useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { UseFormReturn } from 'react-hook-form';
import { Button, TextField, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage as ImageIcon } from '@fortawesome/free-solid-svg-icons';

import Upload from '@/utils/upload';
import Storage from '@/store';
import Loading from '@/imperative-components/loading';
import Dialog from '@/imperative-components/dialog';
import styles from './styles';

interface GalleryFormProps {
  galleryForm: UseFormReturn<Gallery>;
}

const GalleryForm: React.FC<GalleryFormProps> = (props: GalleryFormProps) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const [url, setUrl] = useState('');
  const [picCount, setPicCount] = useState(0);

  const addUrl = (imgUrl: string) => {
    const imageList = [...(props.galleryForm.getValues().imageList || [])];
    if (imageList.includes(imgUrl)) {
      new Dialog({
        title: '添加失败',
        content: '已添加此图片',
        showCancel: false,
      });
    } else {
      props.galleryForm.setValue('imageList', [...imageList, imgUrl]);
      setPicCount(imageList.length + 1);
    }
    setUrl('');
  };

  const removeUrl = (index: number) => {
    const newUrlList = [...props.galleryForm.getValues().imageList];
    newUrlList.splice(index, 1);
    props.galleryForm.setValue('imageList', newUrlList);
    setPicCount(newUrlList.length);
  };

  const uploadFile = async (file: File) => {
    if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      const uploadFunction = Upload[storage.settings.getUploadTarget()].upload;
      const loading = new Loading();
      try {
        const imgUrl = await uploadFunction(file);
        addUrl(imgUrl);
      } catch (err) {
        new Dialog({
          title: '上传失败',
          content: (err as Error).message,
          showCancel: false,
        });
      }
      loading.close();
    } else {
      new Dialog({
        title: '上传失败',
        content: '只允许上传图片',
        showCancel: false,
      });
    }
  };

  const pickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const dropFile: DragEventHandler = (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const preventDefault: DragEventHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className={classes.container}>
      <Typography variant="subtitle1" className="section-title" gutterBottom>
        已添加 {picCount} 张图片
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
          onClick={() => addUrl(url)}
        >
          添加
        </Button>
      </div>
      <Typography variant="subtitle1" className="section-title" gutterBottom>
        上传图片
      </Typography>
      <input
        id="image-upload-dragger"
        type="file"
        onChange={pickFile}
        accept="image/png, image/jpg, image/jpeg"
      />
      <label
        htmlFor="image-upload-dragger"
        className="image-upload-dragger"
        draggable
        onDrop={dropFile}
        onDragOver={preventDefault}
      >
        <FontAwesomeIcon icon={ImageIcon} size="4x" className="image-upload-dragger-icon" />
        拖拽文件到此区域
      </label>
    </div>
  );
};

export default GalleryForm;
