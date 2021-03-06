import React, {useState} from 'react';
import {fade, makeStyles} from '@material-ui/core/styles';
import {InputBase} from '@material-ui/core';
import {DataFilter, ServiceFeatures} from '../../../../assets/data/dataType';
import SearchIcon from '@material-ui/icons/Search';

export interface Props {
  filter: DataFilter;
  possibleFilterValues: ServiceFeatures;
  setFilter: (filter: DataFilter) => void;
  displayChips?: boolean;
}

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

export default function SearchBarComponentContainer(props: Props) {
  const classes = useStyles();
  const [text, setText] = useState('');

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const keyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      props.setFilter({
        ...props.filter,
        fulltext: [...props.filter.fulltext, text],
      });
      setText('');
    }
  };

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search… (e.g. API Gateway)"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        // inputProps={{'aria-label': 'search'}}
        value={text}
        onChange={handleChangeText}
        onKeyDown={keyPress}
      />
    </div>
  );
}
