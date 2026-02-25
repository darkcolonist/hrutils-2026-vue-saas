import { Button, CircularProgress } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';

export default ({ processing, children = 'Save' }) =>
  <Button disabled={processing} type="submit" startIcon={
    processing
      ? <CircularProgress size={16} />
      : <SaveIcon />
  } variant='contained' color='success'>{children}</Button>