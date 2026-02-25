import React from 'react';
import Box from '@mui/material/Box';
import { Link, usePage } from '@inertiajs/react';
import { Alert, IconButton, Typography } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import moment from 'moment';
import { getSearchParams } from '@/Helpers/URLHelper';
import NewButton from '@/Components/NewButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Permission from '@/Components/Permission';

const BaseDataGrid = React.lazy(() => import('@/Components/DataGrid'));

const columns = [
  { field: 'id', width: 50 },
  { field: 'firstname', headerName: 'First Name', width: 175 },
  { field: 'lastname', headerName: 'Last Name', width: 175 },
  { field: 'email', headerName: 'Email', width: 175 },
  {
    field: 'role', headerName: 'Role', width: 175, renderCell: (params) =>
      <Typography title={params.value}>
        {params.row.is_active
          ? <span title={`${params.row.email} can login`}><CheckCircleIcon size="small" /></span>
          : <span title={`${params.row.email} cannot login`}><RemoveCircleOutlineIcon size="small" /></span>
        } {params.value}
      </Typography>
},
  {
    field: 'created_at', headerName: 'Added', width: 150
    , renderCell: (params) =>
      <Typography title={params.value}>
        {moment(params.value).fromNow()}
      </Typography>
  },
  {
    field: 'updated_at', headerName: 'Updated', width: 150
    , renderCell: (params) =>
      <Typography title={params.value}>
        {moment(params.value).fromNow()}
      </Typography>
  },
  {
    field: 'options', headerName: '', width: 150, align: 'center'
    , sortable: false
    , renderCell: (params) => (
      <React.Fragment>
        <IconButton size='small' title={`view ${params.row.firstname}`}>
          <Link href={"users/view/" + params.row.email}>
            <PreviewIcon />
          </Link>
        </IconButton>
      </React.Fragment>
    )
  },
];

export default function DataGrid() {
  const { flash, users } = usePage().props;
  localStorage.setItem('back-url', window.location.href);

  return (
    <Box sx={{ width: '100%' }}>
      {flash.message ? <Alert color='success' sx={{ my: 2 }}>{flash.message}</Alert> : null}
      <BaseDataGrid
        entityName='users'
        rows={users.data}
        columns={columns}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
          pagination: {
            paginationModel: {
              pageSize: users.per_page,
              page: users.current_page - 1
            },
          },

          sorting: {
            sortModel: getSearchParams('sortModel', true)
          }
        }}
        pageSizeOptions={[users.per_page]}
        rowCount={users.total}

        toolbarItems={
          <React.Fragment>
            <Permission can='create users'>
              <NewButton size='small' href='/users/new'>New User</NewButton>
            </Permission>
          </React.Fragment>
        }
      />
    </Box>
  );
}