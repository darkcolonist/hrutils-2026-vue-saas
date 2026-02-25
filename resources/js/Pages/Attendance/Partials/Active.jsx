import { Divider, Grid } from '@mui/material';
import React from 'react';
import EmployeeTile from './EmployeeTile';

export default function Active({ data, ...props }) {
  const active = data.filter(log => log.log_type === 'In');

  return (
    active.length
      ? <React.Fragment>
          <Divider>Active</Divider>
            <Grid container spacing={{md: 2, xs: 1}}>
              {active.map((anActiveUser, i) => (
                <Grid item xs={2} key={i}>
                  <EmployeeTile employee={anActiveUser} />
                </Grid>
              ))}
            </Grid>
        </React.Fragment>
      : <Divider><em><small>No Active Employees at this time</small></em></Divider>
  );
}