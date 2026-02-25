import AxiosWrapper from '@/Components/AxiosWrapper';
import CustomDialog from '@/Components/CustomDialog';
import KeyValueGrid, { defaultAdditional } from '@/Components/KeyValueGrid';
import { format } from '@/Helpers/Number';
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import moment from 'moment/moment';
import React from 'react';
import CustomList from '@/Components/CustomList';
import RealtimeTimestamp from '@/Components/RealtimeTimestamp';
import ArrayOfObjectsTable from '@/Components/ArrayOfObjectsTable';

const renderDigits = (number) => {
  number = format(number);
  return <Typography textAlign="right">{number}</Typography>
}

const renderDigitsWithWarning = (number) => {
  const emphasizedStyles = {
    textShadow: '0 0 10px rgba(255, 0, 0, 1)',
    color: 'orange',
    opacity: 1,
    fontWeight: 'bold'
  };

  const sx = number > 0 ? emphasizedStyles : {
    opacity: 0.2,
    fontSize: '.5em',
  };

  number = format(number, 2);

  return <Typography sx={sx} textAlign="right">{number}</Typography>
}

const AttendanceSummary = ({summary, start, end, user}) => {
  const baseSummary = summary[0];

  const definitions = {
    total_late_minutes: {
      title: "Total Late (Minutes)",
      render: renderDigitsWithWarning
    },
    total_undertime_minutes: {
      title: "Total Undertime (Minutes)",
      render: renderDigitsWithWarning
    },
    total_lwp: {
      title: "Total Paid Leaves",
      render: renderDigits
    },
    total_lwop: {
      title: "Total Unpaid Leaves",
      render: renderDigitsWithWarning
    },
    awol: {
      title: "AWOL",
      render: renderDigitsWithWarning
    },
    ncns: {
      title: "NCNS",
      render: renderDigitsWithWarning
    },
    suspension: {
      title: "Suspension",
      render: renderDigitsWithWarning
    }
  };

  const additional = {
    ...defaultAdditional,
    label_xs: 6,
    value_xs: 6,
    grid_spacing: 0,
    grid_item_sx: {
      ...defaultAdditional.grid_item_sx,
      borderBottom: '1px dotted #aaa',
      px: 1
    },
    grid_container_sx: {
      ...defaultAdditional.grid_container_sx,
      '&:hover': {
        backgroundColor: '#333', // Highlight color on hover
      },
    }
  }

  const selectedColumnsDateList = summary.dateList.map(({ is_halfday
    , original_dates, days_ago, ...rest }) => ({
    ...rest,
  }));

  return <React.Fragment>
    <Stack direction='row'
      spacing={1}
      sx={{
        alignItems: "center",
      }}
    >
      <Typography variant='h6'>Attendance data from {moment(start).fromNow()} to present.</Typography>
      <CustomDialog
        buttonLabel={<InfoOutlinedIcon />}
        dialogTitle={`Attendance Details for ${user.company_email}`}
        dialogContent={
          <ArrayOfObjectsTable
            name="dateList"
            lines={selectedColumnsDateList}
            customizations={{
              "date": {
                render: value => (
                  <RealtimeTimestamp>{value}</RealtimeTimestamp>
                ),
                align: 'right'
              },
              "category": {},
              "reason": {},
              "is_with_pay": {
                render: value => (value ? '✓' : ''),
                align: 'center'
              }
            }}
          />}
      />
    </Stack>
    <KeyValueGrid entries={baseSummary} definitions={definitions}
      additional={additional}
    />
  </React.Fragment>
}

export default function Attendance({ user, ...props }) {
  return (
    user.company_email ? <AxiosWrapper
      method='post'
      routeName='background.check.attendance'
      params={{
        email: user.company_email
      }}
      after={(data) =>
        <React.Fragment>
          <AttendanceSummary summary={data.summary}
            start={data.start}
            end={data.end}
            user={user}
          />
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </React.Fragment>
      }
    /> : 'user doesn\'t have an email'
  );
}