import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import path from 'path';
import hljs from 'highlight.js';
import juice from 'juice';
import prettier from 'prettier';
import parser from 'prettier/parser-postcss';
import { createUseStyles } from 'react-jss';
import { Button, MenuItem, TextField, Typography, useTheme } from '@mui/material';

import Storage from '@/store';
import RichTextRenderer from '@/components/rich-text-renderer';
import exampleMarkdown from '@/consts/exampleMarkdown';
import { themes as presetThemes } from '@/consts/presetThemes';
import { openWindow } from '@/utils/window';
import { isWindows as getIsWindows } from '@/utils/platform';
import { GET_THEME_LIST } from '@/apis';
import Message from '@/imperative-components/message';
import styles from './styles';
import SelectableList from './selectable-theme-list';
import { ThemeType } from './types';

const hljsStyleSheetFiles = import.meta.globEager('/src/consts/hljs/*.css', {
  assert: { type: 'raw' },
});
const hljsThemes = Object.keys(hljsStyleSheetFiles).map((filePath) => ({
  name: filePath.split(path.sep).pop()?.split('.')[0],
  styleSheet: hljsStyleSheetFiles[filePath],
}));

const Themes: React.FC = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const storage = Storage();
  const [isWindows] = useState(getIsWindows());
  const [currentTab, setCurrentTab] = useState('general');
  const [localThemeList, setLocalThemeList] = useState(storage.themes.getThemeList());
  const [onlineThemeList, setOnlineThemeList] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(presetThemes[0]);
  const [defaultTheme, setDefaultTheme] = useState<Theme>(presetThemes[0]);
  const [hljsTheme, setHljsTheme] = useState(storage.themes.getDefaultHljsTheme() || 'default');
  const [hljsPreview, setHljsPreview] = useState('');
  const localThemeListRef = useRef(localThemeList);
  const onlineThemeListRef = useRef(onlineThemeList);
  const selectedThemeRef = useRef<Theme>(selectedTheme);
  const defaultThemeRef = useRef<Theme>(defaultTheme);

  storage.themes.watchThemeList((themes) => setLocalThemeList(themes));

  // 默认主题变更同步到 state
  storage.themes.watchDefaultThemeId((themeId) =>
    setDefaultTheme(
      [...presetThemes, ...localThemeListRef.current, ...onlineThemeListRef.current].find(
        (item) => item.id === themeId,
      ) || presetThemes[0],
    ),
  );

  const onListSelect = (item: Theme) => {
    setSelectedTheme(item);
  };

  const addTheme = () => {
    openWindow({ title: '主题编辑器', path: '/theme-editor', width: 1200, height: 800 });
  };

  // 获取到在线主题或变更本地主题时，需要重置已选中主题和默认主题
  useEffect(() => {
    // 如果默认主题被删除了，第一个内置主题设为默认
    const defaultThemeId = storage.themes.getDefaultThemeId();
    const newDefaultThemeId =
      [...presetThemes, ...localThemeList, ...onlineThemeList].find(
        (item) => item.id === defaultThemeId,
      ) || presetThemes[0];
    setDefaultTheme(newDefaultThemeId);
    // 如果被选中的主题被删除了，自动选中默认主题
    const selectedThemeId = selectedThemeRef.current.id;
    const newSelectedTheme =
      [...presetThemes, ...localThemeList, ...onlineThemeList].find(
        (item) => item.id === selectedThemeId,
      ) || newDefaultThemeId;
    setSelectedTheme(newSelectedTheme);
  }, [localThemeList, onlineThemeList]);

  useEffect(() => {
    selectedThemeRef.current = selectedTheme;
  }, [selectedTheme]);

  useEffect(() => {
    defaultThemeRef.current = defaultTheme;
  }, [defaultTheme]);

  useEffect(() => {
    storage.themes.setDefaultHljsTheme(hljsTheme);
    const css = String(
      (
        hljsThemes.find((item) => item.name === hljsTheme) ||
        hljsThemes.find((item) => item.name === 'default')
      )?.styleSheet,
    );
    const parsedCss = prettier.format(`${css}`, { parser: 'css', plugins: [parser] });
    const html = hljs
      .highlight(parsedCss, { language: 'css' })
      .value.replaceAll('\n', '<br />')
      .replaceAll('  ', '&nbsp;&nbsp;');
    const styledHtml = juice.inlineContent(`<pre class="hljs"><code>${html}</code></pre>`, css);
    setHljsPreview(styledHtml);
  }, [hljsTheme]);

  useEffect(() => {
    axios
      .get(GET_THEME_LIST)
      .then((res) => {
        setOnlineThemeList(res.data.list);
      })
      .catch(() => {
        new Message({ type: 'error', content: '获取在线主题失败' });
      });
  }, []);

  return (
    <div className={classes.themes}>
      <div className="theme-list">
        <div className="theme-list-tab">
          <div
            className={`theme-list-tab-item ${currentTab === 'general' ? 'active' : ''}`}
            onClick={() => setCurrentTab('general')}
          >
            整体样式
          </div>
          <div
            className={`theme-list-tab-item ${currentTab === 'code' ? 'active' : ''}`}
            onClick={() => setCurrentTab('code')}
          >
            代码样式
          </div>
        </div>
        {currentTab === 'general' ? (
          <>
            <SelectableList
              themeList={[
                ...presetThemes.map((item) => ({ type: ThemeType.PRESET, ...item })),
                ...localThemeList.map((item) => ({ type: ThemeType.CUSTOM, ...item })),
                ...onlineThemeList.map((item) => ({ type: ThemeType.ONLINE, ...item })),
              ]}
              onSelect={onListSelect}
              selectedTheme={selectedTheme}
              defaultTheme={defaultTheme}
            />
            <div className="add-theme">
              <Button color="primary" variant="contained" onClick={addTheme} fullWidth>
                添加主题
              </Button>
            </div>
          </>
        ) : (
          <div className="code-theme">
            <TextField
              size="small"
              label="选择样式"
              select
              fullWidth
              value={hljsTheme}
              onChange={(e) => setHljsTheme(e.target.value)}
            >
              {Object.keys(hljsStyleSheetFiles).map((filePath) => {
                const themeName = filePath.split(path.sep).pop()?.split('.')[0];
                return (
                  <MenuItem key={themeName} value={themeName}>
                    {themeName}
                  </MenuItem>
                );
              })}
            </TextField>
            <div className="code-theme-preview" dangerouslySetInnerHTML={{ __html: hljsPreview }} />
          </div>
        )}
      </div>
      <div className="theme-preview">
        <div className={`theme-preview-title ${isWindows ? 'app-wrapper-padding' : ''}`}>
          <Typography variant="h4" className="article-preview-title-text">
            {selectedTheme.name}
          </Typography>
        </div>
        <div className="theme-preview-content">
          <RichTextRenderer
            elementId="theme-preview-content-inner"
            markdown={exampleMarkdown}
            styleSheet={selectedTheme.styleSheet}
          />
        </div>
      </div>
    </div>
  );
};

export default Themes;
