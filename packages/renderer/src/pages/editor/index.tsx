import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import Vditor from 'vditor';
import html2canvas from 'html2canvas';
import { createUseStyles } from 'react-jss';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { Button, TextField, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan as DeleteIcon, faCopy as CopyIcon } from '@fortawesome/free-solid-svg-icons';

import useThemeContext from '@/contexts/theme';
import AppWrappper from '@/components/app-wrappper';
import RichTextRenderer from '@/components/rich-text-renderer';
import Message from '@/imperative-components/message';
import Dialog from '@/imperative-components/dialog';
import Loading from '@/imperative-components/loading';
import Upload from '@/utils/upload';
import { closeWindow } from '@/utils/window';
import { changeUrlParams } from '@/utils/url';
import { isWindows as getIsWindows } from '@/utils/platform';
import Storage from '@/store';
import GallerForm from './gallery-form';
import styles from './styles';

const Editor: React.FC = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const { darkMode } = useThemeContext();

  const [isWindows] = useState(getIsWindows());
  const [id, setId] = useState(
    new URLSearchParams(window.location.hash.split('?').pop()).get('id'),
  );
  const [editor, setEditor] = useState<Vditor>();
  const [markdown, setMarkdown] = useState('');
  const idRef = useRef(id);
  const editorRef = useRef(editor);

  const articleForm = useForm<Article>();
  const galleryForm = useForm<Gallery>();

  const uploadHandler = async (files: File[]) => {
    const uploadFunction = Upload[storage.settings.getUploadTarget()].upload;
    if (editorRef.current) {
      const loading = new Loading();
      try {
        const url = await uploadFunction(files[0]);
        editorRef.current.insertValue(`![图片](${url})`);
      } catch (err) {
        new Dialog({
          title: '上传失败',
          content: (err as Error).message,
          showCancel: false,
        });
      }
      loading.close();
    }
    return null;
  };

  const watchEditorContentChange = (value: string) => {
    articleForm.setValue('content', value, { shouldDirty: true });
    setMarkdown(value);
  };

  const saveAsNew = () => {
    const newId = uuid();
    const article: Article = {
      ...articleForm.getValues(),
      id: newId,
      createTime: new Date(),
      updateTime: new Date(),
    };
    storage.articles.addArticle(article);
    changeUrlParams({ id: newId });
    setId(newId);
    articleForm.reset(article);
  };

  const save = () => {
    if (idRef.current) {
      const article: Article = {
        ...articleForm.getValues(),
        updateTime: new Date(),
      };
      storage.articles.updateArticle(idRef.current, article);
      articleForm.reset(article);
    } else {
      saveAsNew();
    }
  };

  const remove = () => {
    new Dialog({
      title: '操作确认',
      content: '确定删除文章吗？',
      onConfirm: () => {
        storage.articles.removeArticle(id as string);
        closeWindow();
      },
    });
  };

  const copy = () => {
    const element = document.getElementById('rich-text-renderer') as HTMLElement;
    element.focus();
    window.getSelection()?.removeAllRanges();
    const range = document.createRange();
    range.setStartBefore(element.firstChild as Node);
    range.setEndAfter(element.lastChild as Node);
    window.getSelection()?.addRange(range);
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
    new Message({ type: 'success', content: '复制成功' });
  };

  const saveAsImage = () => {
    const element = document.getElementById('rich-text-renderer') as HTMLElement;
    const loading = new Loading();
    html2canvas(element, {
      allowTaint: true,
      backgroundColor: theme.palette.background.default,
    })
      .then((canvas) => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL();
        a.download = `${articleForm.getValues().title || '无标题'}.png`;
        const event = new MouseEvent('click');
        a.dispatchEvent(event);
      })
      .catch(() => new Message({ type: 'error', content: '保存失败' }))
      .finally(() => loading.close());
  };

  const insertGallery = () => {
    const dialog = new Dialog({
      title: '插入多图',
      content: <GallerForm galleryForm={galleryForm} />,
      onConfirm: () => {
        const { imageList } = galleryForm.getValues();
        if (!imageList?.length) {
          new Message({
            type: 'error',
            content: '必须选择至少一张图片',
          });
        } else {
          editor?.insertValue(`
            <div class="gallery-wrapper">
              <div class="gallery">
                ${imageList
                  .map(
                    (image) => `
                      <div class="image-wrapper">
                        <img class="image" src="${image}" />
                      </div>
                    `,
                  )
                  .join()}
              </div>
            </div>
          `);
          dialog.close();
        }
      },
      onCancel: () => {
        dialog.close();
        galleryForm.reset({ imageList: [] });
      },
      closeOnClick: false,
    });
  };

  storage.articles.watchArticleList((articleList) => {
    if (idRef.current && !articleList.find((article) => article.id === idRef.current)) {
      new Message({
        content: '正在编辑的文件已被删除，请重新保存',
        type: 'warning',
      });
      articleForm.setValue('id', '', { shouldDirty: true });
      changeUrlParams({});
      setId('');
    }
  });

  storage.settings.watchDarkMode((newDarkMode) => {
    editor?.setTheme(newDarkMode ? 'dark' : 'classic');
  });

  useEffect(() => {
    let content = '';
    if (idRef.current) {
      const article = storage.articles.getArticleList().find((item) => item.id === idRef.current);
      if (article) {
        content = article.content;
        setMarkdown(article.content);
        articleForm.reset(article);
      }
    }
    const vditor: Vditor = new Vditor('vditor', {
      theme: darkMode ? 'dark' : 'classic',
      preview: {
        theme: {
          current: darkMode ? 'dark' : 'light',
          list: { dark: 'Dark', light: 'Light', wechat: 'WeChat' },
        },
      },
      toolbar: [
        'edit-mode',
        'content-theme',
        'code-theme',
        'undo',
        'redo',
        'upload',
        '|',
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        'inline-code',
        'link',
        '|',
        'list',
        'ordered-list',
        'check',
        'quote',
        'code',
        'table',
        'line',
        '|',
        'outdent',
        'indent',
        'insert-before',
        'insert-after',
        {
          name: 'gallery',
          tipPosition: 'n',
          tip: '插入相册',
          icon: '<svg t="1589994565028" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2808" width="32" height="32"><path d="M506.6 423.6m-29.8 0a29.8 29.8 0 1 0 59.6 0 29.8 29.8 0 1 0-59.6 0Z" fill="#0F0F0F" p-id="2809"></path><path d="M717.8 114.5c-83.5 0-158.4 65.4-211.2 122-52.7-56.6-127.7-122-211.2-122-159.5 0-273.9 129.3-273.9 288.9C21.5 562.9 429.3 913 506.6 913s485.1-350.1 485.1-509.7c0.1-159.5-114.4-288.8-273.9-288.8z" fill="#FAFCFB" p-id="2810"></path><path d="M506.6 926c-22 0-61-20.1-116-59.6-51.5-37-109.9-86.4-164.6-139-65.4-63-217.5-220.6-217.5-324 0-81.4 28.6-157.1 80.6-213.1 53.2-57.2 126.4-88.8 206.3-88.8 40 0 81.8 14.1 124.2 41.9 28.1 18.4 56.6 42.8 86.9 74.2 30.3-31.5 58.9-55.8 86.9-74.2 42.5-27.8 84.3-41.9 124.2-41.9 79.9 0 153.2 31.5 206.3 88.8 52 56 80.6 131.7 80.6 213.1 0 103.4-152.1 261-217.5 324-54.6 52.6-113.1 102-164.6 139-54.8 39.5-93.8 59.6-115.8 59.6zM295.4 127.5c-72.6 0-139.1 28.6-187.3 80.4-47.5 51.2-73.7 120.6-73.7 195.4 0 64.8 78.3 178.9 209.6 305.3 53.8 51.8 111.2 100.3 161.7 136.6 56.1 40.4 88.9 54.8 100.9 54.8s44.7-14.4 100.9-54.8c50.5-36.3 108-84.9 161.7-136.6 131.2-126.4 209.6-240.5 209.6-305.3 0-74.9-26.2-144.2-73.7-195.4-48.2-51.9-114.7-80.4-187.3-80.4-61.8 0-127.8 38.5-201.7 117.9-2.5 2.6-5.9 4.1-9.5 4.1s-7.1-1.5-9.5-4.1C423.2 166 357.2 127.5 295.4 127.5z" fill="#141414" p-id="2811"></path><path d="M353.9 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2812"></path><path d="M659.3 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2813"></path><path d="M411.6 538.5c0 52.3 42.8 95 95 95 52.3 0 95-42.8 95-95v-31.7h-190v31.7z" fill="#5B5143" p-id="2814"></path><path d="M506.6 646.5c-59.6 0-108-48.5-108-108v-31.7c0-7.2 5.8-13 13-13h190.1c7.2 0 13 5.8 13 13v31.7c0 59.5-48.5 108-108.1 108z m-82-126.7v18.7c0 45.2 36.8 82 82 82s82-36.8 82-82v-18.7h-164z" fill="#141414" p-id="2815"></path><path d="M450.4 578.9a54.7 27.5 0 1 0 109.4 0 54.7 27.5 0 1 0-109.4 0Z" fill="#EA64F9" p-id="2816"></path><path d="M256 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2817"></path><path d="M703.3 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2818"></path></svg>',
          click: insertGallery,
        },
      ],
      input: watchEditorContentChange,
      upload: { handler: uploadHandler, multiple: false, accept: 'image/*' },
      toolbarConfig: {
        pin: false,
      },
      cache: {
        enable: false,
      },
      icon: 'material',
      value: content,
    });
    setEditor(vditor);
    return () => {
      vditor.destroy();
    };
  }, []);

  useEffect(() => {
    idRef.current = id;
  }, [id]);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  return (
    <AppWrappper noHeight>
      <div className={classes.container}>
        <div className={`editor ${isWindows ? '' : 'app-wrapper-padding'}`}>
          <Controller
            name="title"
            defaultValue=""
            control={articleForm.control}
            render={({ field }) => (
              <TextField label="文章标题" placeholder="无标题" size="small" {...field} />
            )}
          />
          <div id="vditor" className="vditor" />
        </div>
        <div className="preview">
          <div className={`preview-controller ${isWindows ? 'app-wrapper-padding' : ''}`}>
            <Typography variant="h4" className="preview-title" gutterBottom>
              {articleForm.watch('title') || '未命名'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {articleForm.watch('updateTime')
                ? `保存于 ${moment(articleForm.watch('updateTime') || new Date()).format(
                    'YYYY 年 MM 月 DD 日 HH:mm:SS',
                  )}`
                : '尚未保存'}
            </Typography>
            <div className="button-group">
              <Button
                color="success"
                variant="contained"
                className="action-button"
                startIcon={<FontAwesomeIcon icon={CopyIcon} />}
                onClick={copy}
                disabled={!articleForm.watch('content')}
              >
                复制富文本
              </Button>
              <Button
                color="error"
                variant="contained"
                className="action-button"
                onClick={remove}
                startIcon={<FontAwesomeIcon icon={DeleteIcon} />}
                disabled={!id}
              >
                删除
              </Button>
            </div>
            <div className="button-group">
              <Button
                color="primary"
                variant="contained"
                className="action-button"
                onClick={save}
                disabled={
                  !articleForm.formState.isDirty ||
                  !articleForm.watch('content') ||
                  !articleForm.watch('title')
                }
              >
                保存
              </Button>
              <Button
                color="primary"
                variant="contained"
                className="action-button"
                onClick={saveAsNew}
                disabled={!id || !articleForm.watch('content') || !articleForm.watch('title')}
              >
                保存副本
              </Button>
              <Button
                color="primary"
                variant="contained"
                className="action-button"
                onClick={saveAsImage}
                disabled={!articleForm.watch('content') || !articleForm.watch('title')}
              >
                导出图片
              </Button>
            </div>
          </div>
          <div className="preview-wrapper">
            <RichTextRenderer elementId="rich-text-renderer" markdown={markdown} />
          </div>
        </div>
      </div>
    </AppWrappper>
  );
};

export default Editor;
