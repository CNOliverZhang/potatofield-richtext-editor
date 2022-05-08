import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { ipcRenderer } from 'electron';
import { useLocation } from 'react-router';
import { createUseStyles } from 'react-jss';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { Button, TextField, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan as DeleteIcon, faCopy as CopyIcon } from '@fortawesome/free-solid-svg-icons';
import Vditor from 'vditor';

import useThemeContext from '@/contexts/theme';
import AppWrappper from '@/components/app-wrappper';
import Message from '@/imperative-components/message';
import Dialog from '@/imperative-components/dialog';
import { closeWindow } from '@/utils/window';
import { isWindows as getIsWindows } from '@/utils/platform';
import Storage from '@/store';
import styles from './styles';

const Editor: React.FC = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const { darkMode } = useThemeContext();

  const [isWindows] = useState(getIsWindows());
  const [id, setId] = useState(new URLSearchParams(useLocation().search).get('id'));
  const [editor, setEditor] = useState<Vditor>();
  const [previewHtml, setPreviewHtml] = useState('');
  const idRef = useRef(id);

  const articleForm = useForm<Article>();

  const watchEditorContentChange = (value: string) => {
    articleForm.setValue('content', value, { shouldDirty: true });
    Vditor.md2html(value).then((html) => setPreviewHtml(html));
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

  storage.articles.watchArticleList((articleList) => {
    if (idRef.current && !articleList.find((article) => article.id === idRef.current)) {
      new Message({
        content: '正在编辑的文件已被删除，请重新保存',
        type: 'warning',
      });
      articleForm.setValue('id', '', { shouldDirty: true });
      setId('');
    }
  });

  useEffect(() => {
    let content = '';
    if (idRef.current) {
      const article = storage.articles.getArticleList().find((item) => item.id === idRef.current);
      if (article) {
        content = article.content;
        Vditor.md2html(content).then((html) => setPreviewHtml(html));
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
        'preview',
        'edit-mode',
        'content-theme',
        'code-theme',
        'undo',
        'redo',
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
                disabled={!articleForm.watch('content') || !articleForm.watch('title')}
              >
                保存为图片
              </Button>
            </div>
          </div>
          <div className="preview-wrapper" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </div>
    </AppWrappper>
  );
};

export default Editor;
