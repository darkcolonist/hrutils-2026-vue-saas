import React from 'react';
import AuthenticatedSectionLayout from '@/Layouts/AuthenticatedSectionLayout';
import AxiosWrapper from '@/Components/AxiosWrapper';
import Gallery from './Partials/Gallery';
import { Box } from '@mui/material';

export default function Attendance({ auth }) {
  return <AuthenticatedSectionLayout auth={auth} title="Gallery">
    <Box sx={{p:1}}>
      <Gallery />
    </Box>
  </AuthenticatedSectionLayout>
}
