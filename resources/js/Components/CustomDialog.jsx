import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function CustomDialog({ buttonLabel
  , dialogTitle
  , dialogContent}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {React.isValidElement(buttonLabel)
        ? React.cloneElement(buttonLabel, {
            onClick: handleOpen,
            sx: {
              cursor: 'pointer',
              ...(buttonLabel.props.sx || {})
            }
          })
        : <a
            href={`#${dialogTitle}`}
            onClick={(e) => {
              e.preventDefault();
              handleOpen();
            }}
            style={{
              color: 'rgb(144, 202, 249)'
            }}
          >
            {buttonLabel}
          </a>}
      <Dialog open={open} onClose={handleClose}
        maxWidth='xl'
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default CustomDialog;