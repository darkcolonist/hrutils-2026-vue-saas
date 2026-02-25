import React from "react";
import { router } from "@inertiajs/react";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from "./ConfirmationDialog";

export default function ({ href, children = 'Delete'
  , confirmMessage = undefined
  , confirmTitle = "Confirm Deletion"
  , customIcon = undefined
  , customAction = undefined
  , isIconButton = false
  }){
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if(typeof customAction === 'function')
      customAction();
    else
      router.delete(href);
    setIsDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return <React.Fragment>
    <ConfirmationDialog
      open={isDialogOpen}
      onClose={handleCloseDialog}
      onConfirm={handleConfirmDelete}
      title={confirmTitle}
      message={confirmMessage}
    />
    {isIconButton
      ? <IconButton color='error' title={confirmTitle}
          onClick={handleDeleteClick}
        >
          {customIcon ? customIcon : <DeleteIcon />}
        </IconButton>
      : <Button variant='contained' color='error'
          startIcon={customIcon ? customIcon : <DeleteIcon />}
          onClick={handleDeleteClick}
        >{children}</Button>
    }
  </React.Fragment>
}