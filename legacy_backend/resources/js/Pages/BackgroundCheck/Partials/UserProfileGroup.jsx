import { Box, Divider, Grid, Paper } from '@mui/material';
import React from 'react';
import UserProfile from './UserProfile';
import Attendance from './Attendance';
import Loans from './Loans';
import Payrolls from './Payrolls';
import { HidableComponent } from '@/Components/HidableComponent';
import LoanStatistics from './LoanStatistics';

const CustomDivider = () => {
  return <Divider sx={{
    mt: 2,
    borderBottomWidth: 5,
    display: {
      lg: 'none'
    }
  }} />
}

export default function UserProfileGroup({ user, ...props }) {
  return (
    <HidableComponent component={Box}>
      <Grid container spacing={1} component={Paper} sx={{ p: 1 }}>
        <Grid item xs={12} lg={4}>
          <UserProfile user={user} />
          <CustomDivider />
        </Grid>
        <Grid item xs={12} lg={4}>
          <LoanStatistics user={user} />
          <CustomDivider />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Attendance user={user} />
          <CustomDivider />
        </Grid>
        <Grid item xs={12} lg={9}>
          <Loans user={user} />
          <CustomDivider />
        </Grid>
        <Grid item xs={12} lg={3}>
          <Payrolls user={user} />
        </Grid>
      </Grid>
    </HidableComponent>
  );
}