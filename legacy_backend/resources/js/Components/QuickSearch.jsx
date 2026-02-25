import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, TextField, Autocomplete } from '@mui/material';

export default function QuickSearch({ elements, searchLabel = "Search", onEnterButtonPress = element => { console.debug(element) } }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(elements);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === '/' && !event.target.matches('input, textarea')) {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (inputValue === '') {
      setFilteredOptions(elements);
    } else {
      setFilteredOptions(
        elements.filter(element =>
          element[1].toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }
  }, [inputValue, elements]);

  const handleSelect = (event, value) => {
    if (filteredOptions.length) {
      if (typeof onEnterButtonPress === 'function') {
        onEnterButtonPress(filteredOptions[0]);
      } else {
        console.debug('DEBUG: unimplemented behavior', filteredOptions[0]);
      }
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
            justifyContent: 'center',
          },
          '& .MuiPaper-root': {
            marginTop: '10vh', // Adjust as needed
          },
        }}
      >
      <DialogContent sx={{ padding: 1 }}>
        <Autocomplete
          freeSolo
          options={filteredOptions}
          // openOnFocus // use this if you want the dropdown to
                         //   appear on load
          getOptionLabel={(option) => (typeof option === 'string' ? option : option[1])}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              margin="dense"
              label={searchLabel}
              type="text"
              variant="outlined"
              onChange={(event) => setInputValue(event.target.value)}
              sx={{ width: 300 }}
            />
          )}
          onChange={handleSelect}
        />
      </DialogContent>
    </Dialog>
  );
}