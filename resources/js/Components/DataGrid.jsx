import React from 'react';

import { DataGrid as BaseDataGrid } from '@mui/x-data-grid';
import { router } from '@inertiajs/react';
import { getSearchParams, updateSearchParams } from '@/Helpers/URLHelper';
import DataGridToolbar from './DataGridToolbar';

export default function DataGrid({
  toolbarItems = null
  , entityName
  , ...props
}){
  return <BaseDataGrid
    disableRowSelectionOnClick
    paginationMode="server"
    sortingMode="server"
    filterMode='server'

    autoHeight

    disableColumnMenu
    density='compact'

    disableColumnFilter
    disableColumnSelector
    disableDensitySelector
    slots={{ toolbar: DataGridToolbar }}
    slotProps={{
      toolbar: {
        toolbarItems,
        quickSearchValue: getSearchParams('keyword'),
        onQuickSearch: (keyword) => {
          router.visit(route(entityName,
            updateSearchParams('keyword', keyword)
          ));
        }
      },
    }}

    onPaginationModelChange={(model) => {
      router.visit(route(entityName,
        updateSearchParams('page', model.page + 1)
      ));
    }}

    onSortModelChange={(model) => {
      router.visit(route(entityName,
        updateSearchParams('sortModel', JSON.stringify(model))
      ));
    }}

    {...props}
  />
}