import { Button, CircularProgress } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { Link } from "@inertiajs/react";

export default ({ children = 'Create', href, size }) =>
    <Link href={href}>
      <Button startIcon={<AddIcon />} variant='contained'
        size={size}
      >
        {children}
      </Button>
    </Link>