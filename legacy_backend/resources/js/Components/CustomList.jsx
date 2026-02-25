import { List, ListItem, ListItemText } from '@mui/material';
import React from 'react';

export default function CustomList({ listItems = [] }) {
  return (
    <List dense sx={{ listStyleType: 'disc', pl: 3 }}>
      {listItems.map((v, i) =>
        <ListItem key={i} sx={{ display: 'list-item', pl: 0 }}>
          <ListItemText
            primary={v}
          />
        </ListItem>)}
    </List>
  );
}