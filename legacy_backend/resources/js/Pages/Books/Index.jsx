import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Box } from '@mui/material';

const DataGrid = React.lazy(() => import('./Partials/DataGrid'));

export default function Books({ auth }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Books Section</h2>}
    >
      <Head title="Books Section" />

      <div className="py-5">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Box sx={{p:2}}>
            <DataGrid />
          </Box>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
