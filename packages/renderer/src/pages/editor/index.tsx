import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ipcRenderer } from 'electron';
import { useLocation } from 'react-router';
import { createUseStyles } from 'react-jss';
import { Controller, useForm } from 'react-hook-form';
import { Button, TextField, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan as DeleteIcon, faCopy as CopyIcon } from '@fortawesome/free-solid-svg-icons';
import Vditor from 'vditor';

import useThemeContext from '@/contexts/theme';
import AppWrappper from '@/components/app-wrappper';
import Storage from '@/store';
import styles from './styles';

const Editor: React.FC = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const { darkMode } = useThemeContext();

  const [isWindows] = useState(ipcRenderer.sendSync('platform') === 'win32');
  const [id, setId] = useState(new URLSearchParams(useLocation().search).get('id'));
  const [editor, setEditor] = useState<Vditor>();
  const [previewHtml, setPreviewHtml] = useState('');

  const articleForm = useForm<Article>();

  const watchEditorContentChange = (value: string) => {
    articleForm.setValue('content', value, { shouldDirty: true });
    Vditor.md2html(value).then((html) => setPreviewHtml(html));
  };

  useEffect(() => {
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
    });
    setEditor(vditor);
    if (id) {
      const article = storage.articles.getArticleList().find((item) => item.id === id);
      if (article) {
        vditor.setValue(article.content);
      }
    }
    return () => {
      vditor.destroy();
    };
  }, []);

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
        <div className={`preview ${isWindows ? 'app-wrapper-padding' : ''}`}>
          <Typography variant="h4" className="preview-title">
            {articleForm.watch('title') || '未命名'}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="update-time">
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
              startIcon={<FontAwesomeIcon icon={DeleteIcon} />}
              disabled={!id}
            >
              删除
            </Button>
          </div>
          <div className="preview-wrapper" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          <div className="button-group">
            <Button
              color="primary"
              variant="contained"
              className="action-button"
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
      </div>
    </AppWrappper>
  );
};

export default Editor;
