import React from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Badge, IconButton } from '@mui/material';
import CustomDialog from './CustomDialog';

export default function ButtonIconDialog({
  isVisible = true
  , size = "small"
  , count=0
  , children
  , ...props }) {
  return (
    <React.Fragment>
      {isVisible
        ? <CustomDialog
          buttonLabel={<Badge badgeContent={count} color="info">
              <IconButton size={size}>
                <InfoOutlinedIcon />
              </IconButton >
            </Badge>}
            dialogContent={children}
          />
        : null
      }

    </React.Fragment>
  );
}