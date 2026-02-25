import RealtimeTimestamp from '@/Components/RealtimeTimestamp';
import { Avatar, Grid, Hidden, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import WebIcon from '@mui/icons-material/Web';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import moment from 'moment/moment';
import CustomJsonView from '@/Components/JsonView';

const Timelog = function({employee, ...props}){
  const formatTime = (timeString) => {
    return moment(timeString, 'HH:mm').format('ha');
  };
  const typographySx = { display: 'flex', alignItems: 'center', ...props.sx };
  return <React.Fragment>
    {employee.log_type !== null
      ? <Typography sx={typographySx}>
          <span style={{ marginRight: '0.25em' }}>
            {employee.location == 'ats'
              ? <WebIcon fontSize="small" />
              : <FingerprintIcon fontSize="small" />}
          </span>
          <RealtimeTimestamp sx={{ fontSize: "1em" }}>{employee.log_time}</RealtimeTimestamp>
        </Typography>
      : null}
    <Typography sx={typographySx}>
      {formatTime(employee.roster_start_time)} to {formatTime(employee.roster_end_time)}
    </Typography>
  </React.Fragment>
}

export default function EmployeeTile({ employee, ...props }) {
  const avatarSize = 'auto';
  const typographySxMdDown = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
  return (
    <Grid container component={Paper} sx={{p:{md: 1, xs: 0.5}}} spacing={{md: 1, xs: 0.5}}>
      <Grid item xs={12} md={3}><Avatar src={employee.avatar} alt={employee.first_name} sx={{ width: avatarSize, height: avatarSize }} /></Grid>
      <Grid item xs={12} md={9}>
        <Stack>
          <Hidden mdUp>
            <Typography sx={{...typographySxMdDown}}>{employee.first_name.split(" ")[0]}</Typography>
            <Typography sx={{ fontSize: ".8em", ...typographySxMdDown }}>{employee.job_title}</Typography>
            <Timelog employee={employee} sx={{fontSize: ".8em", ...typographySxMdDown}}/>
          </Hidden>
          <Hidden mdDown>
            <Typography>{employee.first_name.split(" ")[0]}</Typography>
            <Typography sx={{ fontSize: ".8em" }}>{employee.job_title}</Typography>
            <Timelog employee={employee} sx={{ fontSize: ".8em" }} />
          </Hidden>
        </Stack>
      </Grid>
      {/* <Grid item xs={12}>
        <CustomJsonView src={employee} />
      </Grid> */}
    </Grid>
  );
}