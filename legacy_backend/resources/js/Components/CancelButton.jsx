import { Button, CircularProgress } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';

export default ({ onClick, processing, children = 'Cancel' }) =>
  <Button disabled={processing} startIcon={
    processing
      ? <CircularProgress size={16} />
      : <CancelIcon />
  } variant='outlined' onClick={onClick}>{children}</Button>