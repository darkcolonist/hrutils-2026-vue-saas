import React from 'react';
import AuthenticatedSectionLayout from '@/Layouts/AuthenticatedSectionLayout';
import { Box, Typography } from '@mui/material';
import HrappEmployeeRequests from './Dashboard/Partials/HrappEmployeeRequests';

export default function Dashboard({ auth, view_hrapp_employee_requests, formats }) {
  return (
    <AuthenticatedSectionLayout auth={auth} title={"Dashboard"}>
      {view_hrapp_employee_requests
        ? <Box sx={{p:2}}>
          <HrappEmployeeRequests formats={formats} />
          </Box>
        : <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900 dark:text-gray-100">
                  <Typography>You are logged in!</Typography>
                </div>
              </div>
            </div>
          </div>
      }
    </AuthenticatedSectionLayout>
  );
}
