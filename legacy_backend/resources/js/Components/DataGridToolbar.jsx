import { Box, Grid, TextField } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

export function CustomSearchBox(props) {
  function keyPress(e) {
    if (e.keyCode == 13) {
      var ourNewValue = e.target.value.trim();
      if (typeof props.onQuickSearch === 'function')
        props.onQuickSearch(ourNewValue);
    }
  }

  return <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
    <TextField size='small'
      label="type keyword then ⏎"
      defaultValue={props.quickSearchValue}
      onKeyUp={keyPress}
      variant="standard" />
  </Box>
}

export default function ({ toolbarItems, ...props }) {
  return <GridToolbarContainer>
    <Grid item>{toolbarItems}</Grid>

    <Grid style={{ flex: 1 }} />

    <Grid item>
      <CustomSearchBox
        quickSearchValue={props.quickSearchValue}
        onQuickSearch={props.onQuickSearch}
      />
    </Grid>
  </GridToolbarContainer>
}