import React, { useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useTheme } from '@mui/material';
import hljs from 'highlight.js';
import juice from 'juice';
import Vditor from 'vditor';

import { useThrottle } from '@/utils/tool';
import Storage from '@/store';
import { themes, baseStyleSheet } from '@/consts/preset-themes';
import styles from './styles';

interface RichTextRendererProps {
  elementId: string;
  markdown: string;
  styleSheet?: string;
}

const hljsStyleSheetFiles = import.meta.globEager('/src/consts/hljs/*.css', {
  assert: { type: 'raw' },
});
const hljsThemes = Object.keys(hljsStyleSheetFiles).map((filePath) => ({
  name: filePath.split('/').pop()?.split('.')[0],
  styleSheet: hljsStyleSheetFiles[filePath],
}));

const Editor: React.FC<RichTextRendererProps> = (props) => {
  const storage = Storage();
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });

  const [html, setHtml] = useState('');
  const [styleSheet, setStyleSheet] = useState('');
  const [hljsTheme, setHljsTheme] = useState('');
  const [customThemeList, setCustomThemeList] = useState([...storage.themes.getThemeList()]);

  const customThemeListRef = useRef(customThemeList);

  const rerender = (markdown: string, stylesheet: string) => {
    Vditor.md2html(markdown).then((rawHtml) => {
      const div = document.createElement('div');
      div.innerHTML = rawHtml;
      div.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el as HTMLElement);
      });
      setHtml(
        juice.inlineContent(div.innerHTML, `${baseStyleSheet}\n${stylesheet}`, {
          inlinePseudoElements: true,
        }),
      );
    });
  };

  const debouncedRender = useRef(useThrottle(rerender, 500));

  // 本地存储的主题列表更新时同步，以备之后默认主题更新为新添加的主题
  storage.themes.watchThemeList((themeList) => setCustomThemeList(themeList));

  // 默认主题更新后使用新主题
  storage.themes.watchDefaultThemeId((defaultThemeId) => {
    const defaultTheme =
      [...themes, ...customThemeListRef.current].find((item) => item.id === defaultThemeId) ||
      themes[0];
    setStyleSheet(defaultTheme.styleSheet);
  });

  // 代码主题更新后使用新主题
  storage.themes.watchDefaultHljsTheme((defaultHljsTheme) => setHljsTheme(defaultHljsTheme));

  useEffect(() => {
    customThemeListRef.current = customThemeList;
  }, [customThemeList]);

  // 传入的 markdown 变更或主题样式表变更时重新渲染
  useEffect(() => {
    debouncedRender.current?.(
      props.markdown,
      `${props.styleSheet || styleSheet}\n${
        (
          hljsThemes.find((item) => item.name === hljsTheme) ||
          hljsThemes.find((item) => item.name === 'default')
        )?.styleSheet
      }`,
    );
  }, [props.markdown, styleSheet, hljsTheme, props.styleSheet]);

  useEffect(() => {
    const defaultThemeId = storage.themes.getDefaultThemeId();
    const defaultTheme =
      [...themes, ...customThemeList].find((item) => item.id === defaultThemeId) || themes[0];
    setStyleSheet(defaultTheme.styleSheet);
    setHljsTheme(storage.themes.getDefaultHljsTheme());
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
