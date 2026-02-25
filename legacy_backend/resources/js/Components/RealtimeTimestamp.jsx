import React, { useState, useEffect } from 'react';
import moment from 'moment/moment';
import { Typography } from '@mui/material';
import { usePage } from '@inertiajs/react';

const RealtimeTimestamp = ({ children, titleDisplayFormat = null
  , intervalSeconds = 5000, component='span', removeSuffix=false
  , ...props }) => {
  const [currentTime, setCurrentTime] = useState(moment(children).fromNow(removeSuffix));

  const { formats } = usePage().props;

  titleDisplayFormat = titleDisplayFormat ?? formats.dates.front_end_moment_human;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment(children).fromNow(removeSuffix));
    }, intervalSeconds); // Update every second

    return () => clearInterval(interval);
  }, [children]);

  return (
    <Typography title={moment(children).format(titleDisplayFormat)}
      component={component}
      {...props}
      sx={{
        fontSize: 'inherit'
        , ...props.sx
      }}
      >
      {currentTime}
    </Typography>
  );
};

export default RealtimeTimestamp;
