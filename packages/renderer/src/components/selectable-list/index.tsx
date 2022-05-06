import React from 'react';
import { createUseStyles } from 'react-jss';
import { useTheme } from '@mui/material';

import useThemeContext from '@/contexts/theme';
import styles from './styles';

interface SelectableListProps {
  itemList: SelectableItem[];
  onSelect: (article: Article) => void;
  selectedItem: SelectableItem | null;
}

const SelectableList: React.FC<SelectableListProps> = (props) => {
  const theme = useTheme();
  const classes = createUseStyles(styles)({ theme });
  const { setDarkMode, darkMode } = useThemeContext();
  const { itemList, onSelect, selectedItem } = props;

  return (
    <div className={classes.selectableList}>
      <div />
    </div>
  );
};

export default SelectableList;
