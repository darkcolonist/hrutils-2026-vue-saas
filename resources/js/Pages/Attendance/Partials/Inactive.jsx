import { Divider, Grid } from '@mui/material';
import React from 'react';
import EmployeeTile from './EmployeeTile';

export default function Inactive({ data, ...props }) {
  const active = data.filter(log => (log.log_type !== 'In' && log.position === "Rank and File"));

  return (
    active.length
    ? <React.Fragment>
        <Divider>Inactive</Divider>
        <Grid container spacing={{ md: 2, xs: 1 }}>
          {active.map((anActiveUser, i) => (
            <Grid item xs={2} key={i}>
              <EmployeeTile employee={anActiveUser} />
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
      : <Divider><em><small>No Inactive Employees at this time</small></em></Divider>
  );
}