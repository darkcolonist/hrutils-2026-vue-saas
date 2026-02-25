import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function ConfirmationDialog({ open, onClose, onConfirm
  , title ="Confirm"
  , message ="Are you sure you wish to proceed?"
  , cancelLabel="Cancel"
  , proceedLabel="Proceed" }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm} color="error" variant='contained'>
          {proceedLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;