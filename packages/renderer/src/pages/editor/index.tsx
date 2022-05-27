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
      ],
      input: watchEditorContentChange,
      upload: { handler: uploadHandler },
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
