import React, { useEffect, useState } from 'react';

import styles from './styles';

interface RenderProps {
  value?: File;
  values?: File[];
}

interface UploadProps {
  name?: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
  value?: File[] | File;
  onChange?: (event: UploadChangeEvent) => void;
  render?: React.FC<RenderProps>;
  keepChosenFiles?: boolean;
}

const upload: React.FC<UploadProps> = (props) => {
  const {
    name,
    accept,
    multiple = false,
    className,
    value,
    onChange,
    render,
    keepChosenFiles = false,
    children,
  } = props;

  const [files, setFiles] = useState<File[]>([]);
  const classes = styles();

  useEffect(() => {
    if (value) {
      if (Array.isArray(value)) {
        setFiles(value);
      } else {
        setFiles([value]);
      }
    }
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newFiles;
    if (keepChosenFiles) {
      newFiles = [...Array.from(event.target.files || []), ...files];
    } else {
      newFiles = Array.from(event.target.files || []);
    }
    if (!multiple) {
      newFiles = newFiles.length ? [newFiles[0]] : [];
    }
    const parsedEvent = {
      ...event,
      target: {
        ...event.target,
        value: multiple ? newFiles : newFiles[0],
      },
    };
    onChange?.(parsedEvent);
    setFiles(newFiles);
  };

  return (
    <label className={className}>
      <input
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        className={classes.input}
        onChange={handleChange}
      />
      {render ? render({ value: files[0], values: files }) : children}
    </label>
  );
};

export default upload;
