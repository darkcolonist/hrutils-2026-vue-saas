import React from 'react';
import AuthenticatedSectionLayout from '@/Layouts/AuthenticatedSectionLayout';
import { Box } from '@mui/material';
// import CustomJsonView from '@/Components/JsonView';
import DevCacheTable from './Partials/Table';

export default function DevCache({ auth, cachedData }) {
  return <AuthenticatedSectionLayout auth={auth} title="DEV/Cache">
    <Box sx={{p:1}}>
      {/* <CustomJsonView src={cachedData} /> */}
      <DevCacheTable
        rows={cachedData}
      />
    </Box>
  </AuthenticatedSectionLayout>
}