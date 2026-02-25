import React from 'react';
import AuthenticatedSectionLayout from '@/Layouts/AuthenticatedSectionLayout';
import { Box } from '@mui/material';
import EmployeesTable from './Partials/EmployeesTable';

export default function MyDepartment({ auth }) {
  return <AuthenticatedSectionLayout auth={auth} title="My Department">
    <Box sx={{p:1}}>
      <EmployeesTable />
    </Box>
  </AuthenticatedSectionLayout>
}
