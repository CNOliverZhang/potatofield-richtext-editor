import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { Button, TextField, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan as DeleteIcon } from '@fortawesome/free-solid-svg-icons';
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';

import AppWrappper from '@/components/app-wrappper';
import RichTextRenderer from '@/components/rich-text-renderer';
import Message from '@/imperative-components/message';
import Dialog from '@/imperative-components/dialog';
import { closeWindow } from '@/utils/window';
import { changeUrlParams } from '@/utils/url';
import { isWindows as getIsWindows } from '@/utils/platform';
import { styleSheetTemplate } from '@/consts/preset-themes';
import exampleMarkdown from '@/consts/example-markdown';
import Storage from '@/store';
import styles from './styles';

const Editor: React.FC = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });

  const [isWindows] = useState(getIsWindows());
  const [id, setId] = useState(
    new URLSearchParams(window.location.hash.split('?').pop()).get('id'),
  );
  const idRef = useRef(id);

  const themeForm = useForm<Theme>();

  const codeChange = (code: string) => {
    themeForm.setValue('styleSheet', code, { shouldDirty: true });
  };

  const saveAsNew = () => {
    const newId = uuid();
    const newTheme = {
      ...themeForm.getValues(),
      id: newId,
    };
    storage.themes.addTheme(newTheme);
    changeUrlParams({ id: newId });
    setId(newId);
    themeForm.reset(newTheme);
  };

  const save = () => {
    if (idRef.current) {
      const formData = themeForm.getValues();
      storage.themes.updateTheme(idRef.current, formData);
      themeForm.reset(formData);
    } else {
      saveAsNew();
    }
  };

  const remove = () => {
    new Dialog({
      title: '操作确认',
      content: '确定删除主题吗？',
      onConfirm: () => {
        storage.themes.removeTheme(id as string);
        closeWindow();
      },
    });
  };

  storage.themes.watchThemeList((themeList) => {
    if (idRef.current && !themeList.find((item) => item.id === idRef.current)) {
      new Message({
        content: '正在编辑的主题已被删除，请重新保存',
        type: 'warning',
      });
      themeForm.setValue('id', '', { shouldDirty: true });
      changeUrlParams({});
      setId('');
    }
  });

  useEffect(() => {
    if (idRef.current) {
      const targetTheme = storage.themes.getThemeList().find((item) => item.id === idRef.current);
      themeForm.reset(targetTheme || { styleSheet: styleSheetTemplate });
    } else {
      themeForm.reset({ styleSheet: styleSheetTemplate });
    }
  }, []);

  useEffect(() => {
    idRef.current = id;
  }, [id]);

  return (
    <AppWrappper noHeight>
      <div className={classes.container}>
        <div className={`editor ${isWindows ? '' : 'app-wrapper-padding'}`}>
          <Controller
            name="name"
            defaultValue=""
            control={themeForm.control}
            render={({ field }) => (
              <TextField
                label="名称"
                placeholder="名称"
                size="small"
                className="editor-input"
                {...field}
              />
            )}
          />
          <Controller
            name="description"
            defaultValue=""
            control={themeForm.control}
            render={({ field }) => (
              <TextField
                label="简介"
                placeholder="请输入样式简介或备注"
                size="small"
                className="editor-input"
                {...field}
              />
            )}
          />
          <Controller
            name="styleSheet"
            control={themeForm.control}
            render={() => <></>}
          />
          <div className="editor-code-input">
            <CodeMirror
              value={themeForm.watch('styleSheet')}
              extensions={[css()]}
              onChange={codeChange}
            />
          </div>
        </div>
        <div className="preview">
          <div className={`preview-controller ${isWindows ? 'app-wrapper-padding' : ''}`}>
            <Typography variant="h4" className="preview-title" gutterBottom>
              {themeForm.watch('name') || '未命名'}
            </Typography>
            <div className="button-group">
              <Button
                color="primary"
                variant="contained"
                className="action-button"
                onClick={save}
                disabled={
                  !themeForm.formState.isDirty ||
                  !themeForm.watch('styleSheet') ||
                  !themeForm.watch('name')
                }
              >
                保存
              </Button>
              <Button
                color="primary"
                variant="contained"
                className="action-button"
                onClick={saveAsNew}
                disabled={!id || !themeForm.watch('styleSheet') || !themeForm.watch('name')}
              >
                保存副本
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
          </div>
          <div className="preview-wrapper">
            <RichTextRenderer
              elementId="rich-text-renderer"
              markdown={exampleMarkdown}
              styleSheet={themeForm.watch('styleSheet')}
            />
          </div>
        </div>
      </div>
    </AppWrappper>
  );
};

export default Editor;
