import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { createUseStyles } from 'react-jss';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { Button, TextField, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan as DeleteIcon } from '@fortawesome/free-solid-svg-icons';

import useThemeContext from '@/contexts/theme';
import AppWrappper from '@/components/app-wrappper';
import RichTextRenderer from '@/components/rich-text-renderer';
import Message from '@/imperative-components/message';
import Dialog from '@/imperative-components/dialog';
import { closeWindow } from '@/utils/window';
import { isWindows as getIsWindows } from '@/utils/platform';
import { themes as presetThemes } from '@/consts/presetThemes';
import exampleMarkdown from '@/consts/exampleMarkdown';
import Storage from '@/store';
import styles from './styles';

const Editor: React.FC = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const { darkMode } = useThemeContext();

  const [isWindows] = useState(getIsWindows());
  const [id, setId] = useState(new URLSearchParams(useLocation().search).get('id'));
  const idRef = useRef(id);

  const themeForm = useForm<Theme>();

  const saveAsNew = () => {
    const newId = uuid();
    const newTheme = {
      ...themeForm.getValues(),
      id: newId,
    };
    storage.themes.addTheme(newTheme);
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
      setId('');
    }
  });

  useEffect(() => {
    if (idRef.current) {
      const targetTheme = storage.themes.getThemeList().find((item) => item.id === idRef.current);
      themeForm.reset(targetTheme || { styleSheet: presetThemes[0].styleSheet });
    } else {
      themeForm.reset({ styleSheet: presetThemes[0].styleSheet });
    }
  }, []);

  useEffect(() => {
    idRef.current = id;
  }, [id]);

  return (
    <AppWrappper noHeight>
      <div className={classes.container}>
        <div className={`editor ${isWindows ? '' : 'app-wrapper-padding'}`}>
          <div className="editor-line">
            <Controller
              name="displayName"
              defaultValue=""
              control={themeForm.control}
              render={({ field }) => (
                <TextField
                  label="显示名称"
                  placeholder="显示名称"
                  size="small"
                  className="editor-line-input"
                  {...field}
                />
              )}
            />
            <Controller
              name="name"
              defaultValue=""
              control={themeForm.control}
              render={({ field }) => (
                <TextField
                  label="名称"
                  placeholder="名称"
                  size="small"
                  className="editor-line-input"
                  {...field}
                />
              )}
            />
          </div>
          <div className="editor-line">
            <Controller
              name="description"
              defaultValue=""
              control={themeForm.control}
              render={({ field }) => (
                <TextField
                  label="简介"
                  placeholder="请输入样式简介或备注"
                  size="small"
                  className="editor-line-input"
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            name="styleSheet"
            defaultValue=""
            control={themeForm.control}
            render={({ field }) => (
              <TextField
                label="CSS"
                placeholder="请输入 CSS 样式表单"
                size="small"
                className="editor-text-area"
                InputProps={{ inputComponent: 'textarea' }}
                {...field}
              />
            )}
          />
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
