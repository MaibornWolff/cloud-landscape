import React from 'react';
import {Grid, TextField, TextFieldProps} from '@material-ui/core';

const PATH_PREFIX = './img/logos/';
const PATH_PREFIX_REGEX = /^[.][/\\]img[/\\]logos[/\\](.*)$/;

export interface Props {
  textFieldProps: TextFieldProps;
  onImagePathChanged: (img: string) => void;
  imagePath: string;
}

export default function ImageSelect(props: Props) {
  const handleImgPathChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    props.onImagePathChanged(convertFromShownImgPath(event.target.value));

  const convertFromShownImgPath = (shownPath: string) =>
    PATH_PREFIX + shownPath;
  const convertToShownImgPath = (path: string) => {
    const matches = PATH_PREFIX_REGEX.exec(path);
    if (!matches || matches.length < 2) {
      return path;
    }
    return matches[1];
  };

  const shownImgPath = convertToShownImgPath(props.imagePath);
  return (
    <Grid container>
      <Grid item xs={10}>
        <TextField
          value={shownImgPath}
          onChange={handleImgPathChange}
          fullWidth
          {...props.textFieldProps}
        />
      </Grid>
    </Grid>
  );
}
