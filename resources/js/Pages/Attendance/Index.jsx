import React from 'react';
import { Stack } from '@mui/material';
import AuthenticatedSectionLayout from '@/Layouts/AuthenticatedSectionLayout';
import Active from './Partials/Active';
import Inactive from './Partials/Inactive';
import Managers from './Partials/Managers';
import AttendanceCalendar from './Partials/AttendanceCalendar';

export default function Attendance({ auth, response, formats }) {

  return <AuthenticatedSectionLayout auth={auth} title="Attendance">
    <Stack spacing={1}>
      <Active data={response}/>
      <Inactive data={response}/>
      <Managers data={response}/>
      <AttendanceCalendar formats={formats} />
    </Stack>
  </AuthenticatedSectionLayout>
}
