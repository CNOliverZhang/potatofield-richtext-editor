import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useTheme } from '@mui/material';
import juice from 'juice';
import Vditor from 'vditor';

import { useThrottle } from '@/utils/tool';
import Storage from '@/store';
import presetThemes from '@/consts/presetThemes';
import styles from './styles';

interface RichTextRendererProps {
  elementId: string;
  markdown: string;
}

const Editor: React.FC<RichTextRendererProps> = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });

  const [html, setHtml] = useState('');
  const [styleSheet, setStyleSheet] = useState('');
  const [customThemeList, setCustomThemeList] = useState([...storage.themes.getThemeList()]);

  const customThemeListRef = useRef(customThemeList);

  const rerender = (markdown: string, stylesheet: string) => {
    Vditor.md2html(markdown).then((rawHtml) => {
      setHtml(juice.inlineContent(rawHtml, stylesheet));
    });
  };

  const debouncedRender = useRef(useThrottle(rerender, 500));

  // 本地存储的主题列表更新时同步，以备之后默认主题更新为新添加的主题
  storage.themes.watchThemeList((themeList) => setCustomThemeList(themeList));

  // 默认主题更新后使用新主题
  storage.themes.watchDefaultThemeId((defaultThemeId) => {
    const defaultTheme =
      [...presetThemes, ...customThemeListRef.current].find((item) => item.id === defaultThemeId) ||
      presetThemes[0];
    setStyleSheet(defaultTheme.styleSheet);
  });

  useEffect(() => {
    customThemeListRef.current = customThemeList;
  }, [customThemeList]);

  // 传入的 markdown 变更或主题样式表变更时重新渲染
  useEffect(() => {
    debouncedRender.current?.(props.markdown, styleSheet);
  }, [props.markdown, styleSheet]);

  useEffect(() => {
    const defaultThemeId = storage.themes.getDefaultThemeId();
    const defaultTheme =
      [...presetThemes, ...customThemeList].find((item) => item.id === defaultThemeId) ||
      presetThemes[0];
    setStyleSheet(defaultTheme.styleSheet);
  }, []);

  return (
    <div
      id={props.elementId}
      className={classes.container}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Editor;
