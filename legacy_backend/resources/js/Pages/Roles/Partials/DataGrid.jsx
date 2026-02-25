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
  { field: 'name', headerName: 'Name', width: 175 },
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
  { field: 'permissions_list', headerName: 'Permissions', width: 175
    , renderCell: (params) => <Typography>{params.value == "" ? 0 : params.value.split(',').length}</Typography>},
  {
    field: 'options', headerName: '', width: 150, align: 'center'
    , sortable: false
    , renderCell: (params) => (
      <React.Fragment>
        <IconButton size='small' title={`view ${params.row.name}`}>
          <Link href={"roles/view/" + params.row.name}>
            <PreviewIcon />
          </Link>
        </IconButton>
      </React.Fragment>
    )
  },
];

export default function DataGrid() {
  const { flash, roles } = usePage().props;
  localStorage.setItem('back-url', window.location.href);

  return (
    <Box sx={{ width: '100%' }}>
      {flash.message ? <Alert color='success' sx={{ my: 2 }}>{flash.message}</Alert> : null}
      <BaseDataGrid
        entityName='roles'
        rows={roles.data}
        columns={columns}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
          pagination: {
            paginationModel: {
              pageSize: roles.per_page,
              page: roles.current_page - 1
            },
          },

          sorting: {
            sortModel: getSearchParams('sortModel', true)
          }
        }}
        pageSizeOptions={[roles.per_page]}
        rowCount={roles.total}

        toolbarItems={
          <React.Fragment>
            <Permission can='create roles'>
              <NewButton size='small' href='/roles/new'>New Role</NewButton>
            </Permission>
          </React.Fragment>
        }
      />
    </Box>
  );
}