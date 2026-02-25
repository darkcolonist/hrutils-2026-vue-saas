import { Link } from "@inertiajs/react";
import { Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export default ({ href, children = 'Edit' }) =>
    <Link href={href}>
      <Button variant='outlined' startIcon={<EditIcon />}>
        {children}
      </Button>
    </Link>