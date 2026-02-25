import React from 'react';
import Box from '@mui/material/Box';
import { Link, usePage } from '@inertiajs/react';
import { Alert, IconButton, Typography } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import moment from 'moment';
import { getSearchParams } from '@/Helpers/URLHelper';
import NewButton from '@/Components/NewButton';
import Permission from '@/Components/Permission';

const BaseDataGrid = React.lazy(() => import('@/Components/DataGrid'));

const columns = [
  { field: 'id', width: 50 },
  { field: 'title', headerName: 'Title', width: 350 },
  { field: 'author', headerName: 'Author', width: 350 },
  { field: 'created_at', headerName: 'Added', width: 150
    , renderCell: (params) =>
        <Typography title={params.value}>
          {moment(params.value).fromNow()}
        </Typography>},
  { field: 'updated_at', headerName: 'Updated', width: 150
    , renderCell: (params) =>
        <Typography title={params.value}>
          {moment(params.value).fromNow()}
        </Typography>},
  { field: 'options', headerName: '', width: 150, align: 'center'
    , sortable: false
    , renderCell: (params) => (
      <React.Fragment>
        <IconButton size='small' title={`view ${params.row.title}`}>
          <Link href={"books/view/"+params.row.hash}>
            <PreviewIcon />
          </Link>
        </IconButton>
      </React.Fragment>
    )},
];

export default function DataGrid() {
  const {flash, books} = usePage().props;
  localStorage.setItem('back-url', window.location.href);

  return (
    <Box sx={{ width: '100%' }}>
      {flash.message ? <Alert color='success' sx={{ my: 2 }}>{flash.message}</Alert> : null}
      <BaseDataGrid
        entityName='books'
        rows={books.data}
        columns={columns}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
          pagination: {
            paginationModel: {
              pageSize: books.per_page,
              page: books.current_page-1
            },
          },

          sorting: {
            sortModel: getSearchParams('sortModel', true)
          }
        }}
        pageSizeOptions={[books.per_page]}
        rowCount={books.total}

        toolbarItems={
          <React.Fragment>
            <Permission can='create books'>
              <NewButton size='small' href='/books/new'>New Book</NewButton>
            </Permission>
          </React.Fragment>
        }
      />
    </Box>
  );
}