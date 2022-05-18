import React from 'react';
import { createUseStyles } from 'react-jss';
import { v4 as uuid } from 'uuid';
import { Tooltip, Typography, useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashCan as DeleteIcon,
  faFileEdit as EditIcon,
  faCheckCircle as ChooseIcon,
  faCopy as CopyIcon,
  faGlobe as OnlineIcon,
  faFile as PresetIcon,
  faFilePen as CustomIcon,
} from '@fortawesome/free-solid-svg-icons';

import Dialog from '@/imperative-components/dialog';
import Storage from '@/store';
import { openWindow } from '@/utils/window';
import { ThemeType, ThemeWithTypeInfo } from '../types';
import styles from './styles';

interface SelectableThemeListProps {
  themeList: ThemeWithTypeInfo[];
  onSelect: (theme: Theme) => void;
  selectedTheme: Theme;
  defaultTheme: Theme;
}

const SelectableThemeList: React.FC<SelectableThemeListProps> = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const storage = Storage();
  const { themeList, onSelect, defaultTheme, selectedTheme } = props;

  const edit = (themeId: string) => {
    openWindow({
      title: '主题编辑器',
      path: `/theme-editor?id=${themeId}`,
      width: 1200,
      height: 800,
    });
  };

  const remove = (themeId: string) => {
    new Dialog({
      title: '操作确认',
      content: '确定删除主题吗？',
      onConfirm: () => {
        storage.themes.removeTheme(themeId);
      },
    });
  };

  const choose = (themeId: string) => {
    storage.themes.setDefaultThemeId(themeId);
  };

  const copy = (item: Theme) => {
    const newTheme = {
      id: uuid(),
      name: `${item.name}_副本`,
      styleSheet: item.styleSheet,
      description: item.description,
    };
    storage.themes.addTheme(newTheme);
  };

  return (
    <div className={`${classes.selectableThemeList} ${themeList?.length ? '' : 'empty'}`}>
      {themeList.map((item) => (
        <div
          key={item.id}
          className={`theme ${defaultTheme?.id === item.id ? 'default' : ''} ${
            selectedTheme?.id === item.id ? 'selected' : ''
          }`}
          onClick={() => onSelect(item)}
        >
          <div className="theme-title">
            {defaultTheme.id === item.id && (
              <FontAwesomeIcon icon={ChooseIcon} size="sm" className="theme-title-chosen-icon" />
            )}
            <Typography variant="body1" className="theme-title-text">
              {item.name}
            </Typography>
            {defaultTheme.id !== item.id && (
              <Tooltip title="设为默认">
                <div className="theme-title-action">
                  <FontAwesomeIcon
                    icon={ChooseIcon}
                    size="sm"
                    className="theme-title-action-inner choose"
                    onClick={() => choose(item.id)}
                  />
                </div>
              </Tooltip>
            )}
            <Tooltip title="创建副本">
              <div className="theme-title-action">
                <FontAwesomeIcon
                  icon={CopyIcon}
                  size="sm"
                  className="theme-title-action-inner"
                  onClick={() => copy(item)}
                />
              </div>
            </Tooltip>
            {item.type === ThemeType.CUSTOM && (
              <>
                <Tooltip title="编辑">
                  <div className="theme-title-action">
                    <FontAwesomeIcon
                      icon={EditIcon}
                      size="sm"
                      className="theme-title-action-inner"
                      onClick={() => edit(item.id)}
                    />
                  </div>
                </Tooltip>

                <Tooltip title="删除">
                  <div className="theme-title-action">
                    <FontAwesomeIcon
                      icon={DeleteIcon}
                      size="sm"
                      className="theme-title-action-inner delete"
                      onClick={() => remove(item.id)}
                    />
                  </div>
                </Tooltip>
              </>
            )}
          </div>
          <div className="theme-type">
            {item.type === ThemeType.CUSTOM && <FontAwesomeIcon icon={CustomIcon} size="xs" />}
            {item.type === ThemeType.PRESET && <FontAwesomeIcon icon={PresetIcon} size="xs" />}
            {item.type === ThemeType.ONLINE && <FontAwesomeIcon icon={OnlineIcon} size="xs" />}
            <Typography variant="caption" color="textSecondary">
              {item.type === ThemeType.CUSTOM && '自定义模板'}
              {item.type === ThemeType.PRESET && '预置模板'}
              {item.type === ThemeType.ONLINE && '在线模板'}
            </Typography>
          </div>
          <Typography variant="body2" className="theme-intro">
            {item.description}
          </Typography>
        </div>
      ))}
    </div>
  );
};

export default SelectableThemeList;
