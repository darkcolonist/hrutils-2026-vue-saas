import ArrayOfObjectsTable from '@/Components/ArrayOfObjectsTable';
import AxiosWrapper from '@/Components/AxiosWrapper';
import CustomJsonView from '@/Components/JsonView';
import RealtimeTimestamp from '@/Components/RealtimeTimestamp';
import { parse } from '@/Helpers/JSON';
import { Avatar, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

import React from 'react';

function JsonPopupButton({ jsonData, dialogTitle = "details" }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button size='small' variant="outlined" onClick={handleClickOpen}>Show</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          {/* <pre><code>{jsonData}</code></pre> */}
          {/* <pre><code>{JSON.stringify(JSON.parse(jsonData), null, 2)}</code></pre> */}
          {jsonData}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ArrayOfSortableObjectsTable = ({formats, data}) => {
  const avatarSize = 24;

  /**
   * sort our objects for display column order
   */
  const sortedData = data.map(obj => {
    const { timestamp, request_type, status, employee, executor, json_details, ...rest } = obj;
    return { timestamp, request_type, status, employee, executor, json_details, ...rest };
  });

  return <ArrayOfObjectsTable lines={sortedData}
    customizations={{
      "timestamp": {
        // render: value => <Typography title={moment(value).format(formats.dates.front_end_moment_human)}>{moment(value).fromNow()}</Typography>
        render: value => <RealtimeTimestamp titleDisplayFormat={formats.dates.front_end_moment_human}>{value}</RealtimeTimestamp>
      }
      , "status": {
        render: value => value.includes('pending')
          ? <Chip color='warning' label={value} size='' />
          : value
      }
      , "json_details": {
        render: value => <JsonPopupButton jsonData={<CustomJsonView src={parse(value)} />} />
      }
      , "reason": {
        render: value => (value !== null && value.trim().length > 0) ? <JsonPopupButton jsonData={value} /> : null
      }
      , "executor": {
        render: value => <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ mt: 2, height: avatarSize, width: avatarSize }} src={value['avatar']} />
          <Typography variant='body2'>{value['name']}</Typography>
        </Stack>
      }
      , "employee": {
        render: value => <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ mt: 2, height: avatarSize, width: avatarSize }} src={value['avatar']} />
          <Typography variant='body2'>{value['name']}</Typography>
        </Stack>
      }
    }}
  />
}

export default function HrappEmployeeRequests({ formats, ...props }) {
  return (
    <>
      <AxiosWrapper method="post"
        routeName="dashboard.employee-requests"
        after={(data) => <React.Fragment>
          <Typography paragraph>
            Data cached <RealtimeTimestamp titleDisplayFormat={formats.dates.front_end_moment_human}>{data.timestamp}</RealtimeTimestamp>
          </Typography>
          <ArrayOfSortableObjectsTable {...{ formats, data: data.requests }} />
        </React.Fragment>}
        // after={(data) => <pre>{data}</pre>}
      />
    </>
  );
}