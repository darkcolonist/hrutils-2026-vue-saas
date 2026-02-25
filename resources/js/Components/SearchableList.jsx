import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Paper, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const DefaultListEmptyPlaceholder = () => (
  <Typography color={grey[500]} fontStyle="italic">
    List is empty
  </Typography>
);

const ItemNotFoundDefaultPlaceholder = ({ searchTerm }) => (
  <Typography color={grey[500]} fontStyle="italic">
    {`"${searchTerm}" not found`}
  </Typography>
);

const DefaultSecondaryActionPlaceholder = (({item}) => null);

const SearchableList = ({ data,
  height,
  ItemNotFoundPlaceholder = ItemNotFoundDefaultPlaceholder,
  SecondaryActionPlaceholder = DefaultSecondaryActionPlaceholder,
  ListEmptyPlaceholder = DefaultListEmptyPlaceholder
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(
    (item) => item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const listStyles = height ? { maxHeight: height, overflowY: 'auto' } : {};

  return (
    <Paper sx={{ p: 1 }}>
      <TextField
        label="Search"
        variant="outlined"
        autoComplete='off'
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredData.length === 0 ? (
        searchTerm ? (
          <ItemNotFoundPlaceholder searchTerm={searchTerm} />
        ) : (
          <ListEmptyPlaceholder />
        )
      ) : (
        <List style={listStyles}>
          {filteredData.map((item, index) => (
            <ListItem key={index} secondaryAction={<SecondaryActionPlaceholder item={item} />}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default SearchableList;
