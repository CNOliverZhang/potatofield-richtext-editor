import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { createUseStyles } from 'react-jss';
import { IconButton, TextField, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus as AddIcon } from '@fortawesome/free-solid-svg-icons';

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

const Themes: React.FC = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const storage = Storage();
  const [isWindows] = useState(getIsWindows());
  const [localThemeList, setLocalThemeList] = useState(storage.themes.getThemeList());
  const [onlineThemeList, setOnlineThemeList] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(presetThemes[0]);
  const [defaultTheme, setDefaultTheme] = useState<Theme>(presetThemes[0]);
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
        <div className="theme-list-header">
          <TextField size="small" className="search" label="搜索名称" />
          <IconButton className="add-button">
            <FontAwesomeIcon icon={AddIcon} onClick={addTheme} />
          </IconButton>
        </div>
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
